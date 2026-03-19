import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// Update cart item quantity
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

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return await getCart();
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

// Delete cart item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return await getCart();
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { error: "Failed to remove cart item" },
      { status: 500 }
    );
  }
}

async function getCart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  if (!cartId) {
    return NextResponse.json({
      id: null,
      items: [],
      totalAmount: 0,
    });
  }

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

  if (!cart) {
    return NextResponse.json({
      id: null,
      items: [],
      totalAmount: 0,
    });
  }

  const items = cart.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.product.name,
    productImage: item.product.images?.[0] || "",
    specs: item.specs as Record<string, string> || {},
    price: item.product.price,
    quantity: item.quantity,
    subtotal: item.product.price * item.quantity,
    stock: item.product.stock || 0,
  }));

  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

  return NextResponse.json({
    id: cart.id,
    items,
    totalAmount,
  });
}
