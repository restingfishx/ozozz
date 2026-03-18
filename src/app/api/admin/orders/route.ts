import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Check admin session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;

    // Pagination params
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Filter params
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    // Build where clause
    const where: Prisma.OrderWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { shippingAddress: { path: ["name"], string_contains: search } },
        { shippingAddress: { path: ["phone"], string_contains: search } },
      ];
    }

    // Query data
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          orderItems: {
            select: {
              id: true,
              productName: true,
              productImage: true,
              specs: true,
              price: true,
              quantity: true,
              subtotal: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    // Transform data to match API response format
    const transformedOrders = orders.map((order) => ({
      id: order.id,
      orderNo: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount,
      currency: order.currency,
      trackingNumber: order.trackingNumber,
      paidAt: order.paidAt?.toISOString(),
      shippedAt: order.shippedAt?.toISOString(),
      completedAt: order.completedAt?.toISOString(),
      createdAt: order.createdAt.toISOString(),
      address: order.shippingAddress,
      items: order.orderItems.map((item) => ({
        id: item.id,
        productName: item.productName,
        productImage: item.productImage,
        specs: item.specs,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
    }));

    return NextResponse.json({
      data: transformedOrders,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
