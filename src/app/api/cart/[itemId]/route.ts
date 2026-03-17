import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";

// 更新购物车商品数量
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid quantity" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;

    if (!cartId) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    // 更新数量
    await prisma.cartItem.update({
      where: {
        id: itemId,
        cartId,
      },
      data: {
        quantity,
      },
    });

    // 获取更新后的购物车
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(formatCart(cart));
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

// 删除购物车商品
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;

    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;

    if (!cartId) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    // 删除商品
    await prisma.cartItem.delete({
      where: {
        id: itemId,
        cartId,
      },
    });

    // 获取更新后的购物车
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(formatCart(cart));
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { error: "Failed to remove cart item" },
      { status: 500 }
    );
  }
}

// 格式化购物车数据
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatCart(cart: any) {
  if (!cart) {
    return {
      id: null,
      items: [],
      totalAmount: 0,
    };
  }

  const items = cart.items.map((item: { id: string; productId: string; product?: { name?: string; images?: string[]; price?: number; stock?: number } | null; specs: Prisma.JsonValue; price: number; quantity: number }) => ({
    id: item.id,
    productId: item.productId,
    productName: item.product?.name || "",
    productImage: item.product?.images?.[0] || "",
    specs: item.specs as Record<string, string>,
    price: item.product?.price || item.price,
    quantity: item.quantity,
    subtotal: (item.product?.price || item.price) * item.quantity,
    stock: item.product?.stock || 0,
  }));

  const totalAmount = items.reduce((sum: number, item: { subtotal: number }) => sum + item.subtotal, 0);

  return {
    id: cart.id,
    items,
    totalAmount,
  };
}
