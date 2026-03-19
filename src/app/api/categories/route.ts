import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all distinct categories
    const categories = await prisma.product.findMany({
      where: {
        status: "active",
        category: {
          not: null,
        },
      },
      select: {
        category: true,
      },
      distinct: ["category"],
    });

    const categoryList = categories
      .map((c) => c.category)
      .filter((c): c is string => c !== null);

    return NextResponse.json({
      data: categoryList,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
