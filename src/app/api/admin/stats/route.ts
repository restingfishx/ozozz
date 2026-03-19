import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // Verify admin session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get total orders count
    const totalOrders = await prisma.order.count();

    // Get total sales (sum of all paid orders)
    const totalSalesResult = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: {
          in: ["paid", "shipped", "completed"],
        },
      },
    });
    const totalSales = totalSalesResult._sum.totalAmount || 0;

    // Get pending orders count
    const pendingOrders = await prisma.order.count({
      where: {
        status: "pending",
      },
    });

    return NextResponse.json({
      totalOrders,
      totalSales,
      pendingOrders,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
