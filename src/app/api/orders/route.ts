import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

// Generate order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = randomBytes(4).toString("hex").toUpperCase();
  return `ORD${timestamp}${random}`;
}

// Create order
export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();
    const { cartId, address } = body;

    // Validate required fields
    if (!cartId) {
      return NextResponse.json(
        { error: "Cart ID is required" },
        { status: 400 }
      );
    }

    if (!address) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }

    const requiredFields = ["name", "phone", "country", "province", "city", "district", "detail", "postalCode"];
    for (const field of requiredFields) {
      if (!address[field as keyof Address]) {
        return NextResponse.json(
          { error: `Shipping address ${field} is required` },
          { status: 400 }
        );
      }
    }

    // Get cart
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
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Calculate order amount
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order and order items
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

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId },
    });

    // Note: Skip Stripe integration for now, return empty checkoutUrl
    const checkoutUrl = "";

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
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// Get order list
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

    // Get orders associated with the cart
    // Note: Since orders don't directly link to cartId, we need to query through order items
    // Simplified: return all orders
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
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
