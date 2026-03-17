import Stripe from 'stripe';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { Prisma } from "@prisma/client";

interface Address {
  name: string;
  phone: string;
  country: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  postalCode: string;
}

interface CreateOrderRequest {
  cartId: string;
  address: Address;
}

// 生成订单号
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = randomBytes(4).toString("hex").toUpperCase();
  return `ORD${timestamp}${random}`;
}

// 创建订单
export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();
    const { cartId, address } = body;

    // 验证必填字段
    if (!cartId) {
      return NextResponse.json(
        { error: "购物车 ID 不能为空" },
        { status: 400 }
      );
    }

    if (!address) {
      return NextResponse.json(
        { error: "收货地址不能为空" },
        { status: 400 }
      );
    }

    const requiredFields = ["name", "phone", "country", "province", "city", "district", "detail", "postalCode"];
    for (const field of requiredFields) {
      if (!address[field as keyof Address]) {
        return NextResponse.json(
          { error: `收货地址 ${field} 不能为空` },
          { status: 400 }
        );
      }
    }

    // 获取购物车
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "购物车为空" },
        { status: 400 }
      );
    }

    // 计算订单金额
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 生成订单号
    const orderNumber = generateOrderNumber();

    // 创建订单和订单项
    const order = await prisma.order.create({
      data: {
        orderNumber,
        totalAmount,
        shippingAddress: address as unknown as Prisma.JsonObject,
        orderItems: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            productImage: item.product.images?.[0] || null,
            specs: item.specs as unknown as Prisma.JsonObject,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    // 清空购物车
    await prisma.cartItem.deleteMany({
      where: { cartId },
    });

    // Create Stripe Checkout Session
    let checkoutUrl = '';
    let stripeSessionId = '';

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: order.orderItems.map((item) => ({
          price_data: {
            currency: order.currency.toLowerCase(),
            product_data: {
              name: item.productName,
              images: item.productImage ? [item.productImage] : [],
              metadata: {
                productId: item.productId,
                specs: JSON.stringify(item.specs),
              },
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: `${baseUrl}/payment/success/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/payment/cancel?orderId=${order.id}`,
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
      });

      checkoutUrl = session.url || '';
      stripeSessionId = session.id;

      // Update order with stripe session id
      await prisma.order.update({
        where: { id: order.id },
        data: { stripeSessionId },
      });
    } catch (stripeError) {
      console.error('Error creating Stripe checkout session:', stripeError);
      // Continue without Stripe checkout URL
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNo: order.orderNumber,
        status: order.status,
        items: order.orderItems.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          specs: item.specs as Record<string, string> || {},
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
        address: order.shippingAddress,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt.toISOString(),
      },
      checkoutUrl,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "订单创建失败" },
      { status: 500 }
    );
  }
}

// 获取订单列表
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;

    if (!cartId) {
      return NextResponse.json({
        data: [],
        total: 0,
        page: 1,
        limit: 12,
      });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // 获取该购物车关联的订单
    // 注意：由于订单不直接关联 cartId，需要通过订单项间接查询
    // 这里简化处理，返回所有订单
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          orderItems: true,
        },
      }),
      prisma.order.count(),
    ]);

    return NextResponse.json({
      data: orders.map((order) => ({
        id: order.id,
        orderNo: order.orderNumber,
        status: order.status,
        items: order.orderItems.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          specs: item.specs as Record<string, string> || {},
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
        address: order.shippingAddress,
        totalAmount: order.totalAmount,
        paidAt: order.paidAt?.toISOString(),
        shippedAt: order.shippedAt?.toISOString(),
        trackingNumber: order.trackingNumber,
        createdAt: order.createdAt.toISOString(),
      })),
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "获取订单列表失败" },
      { status: 500 }
    );
  }
}
