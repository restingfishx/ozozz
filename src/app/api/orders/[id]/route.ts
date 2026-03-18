import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

// 获取订单详情
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
