import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { trackingNumber } = body;

    // Validate tracking number
    if (!trackingNumber || typeof trackingNumber !== "string") {
      return NextResponse.json(
        { error: "Tracking number is required" },
        { status: 400 }
      );
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        trackingNumber,
        // Automatically set status to shipped if not already
        status: order.status === "paid" ? "shipped" : order.status,
        shippedAt: order.status === "paid" ? new Date() : order.shippedAt,
      },
    });

    return NextResponse.json({
      success: true,
      trackingNumber: updatedOrder.trackingNumber,
      status: updatedOrder.status,
    });
  } catch (error) {
    console.error("Error updating tracking number:", error);
    return NextResponse.json(
      { error: "Failed to update tracking number" },
      { status: 500 }
    );
  }
}
