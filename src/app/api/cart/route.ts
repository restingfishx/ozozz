import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// 获取购物车
export async function GET() {
  try {
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
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// 添加商品到购物车
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity, specs } = body;

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid product or quantity" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    let cartId = cookieStore.get("cartId")?.value;

    const product = await prisma.product.findUnique({
      where: { id: productId, status: "active" },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    let cart;

    if (!cartId) {
      cart = await prisma.cart.create({
        data: {
          items: {
            create: {
              productId,
              price: product.price,
              quantity,
              specs: specs || {},
            },
          },
        },
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

      cartId = cart.id;
    } else {
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId,
          productId,
          specs: specs || {},
        },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + quantity,
          },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId,
            productId,
            price: product.price,
            quantity,
            specs: specs || {},
          },
        });
      }

      cart = await prisma.cart.findUnique({
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
    }

    if (!cart) {
      return NextResponse.json(
        { error: "Failed to update cart" },
        { status: 500 }
      );
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

    const response = NextResponse.json({
      id: cart.id,
      items,
      totalAmount,
    });

    response.cookies.set("cartId", cartId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}
