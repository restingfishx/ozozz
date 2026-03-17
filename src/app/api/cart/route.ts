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

    // 格式化购物车数据
    const items = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      productImage: item.product.images[0] || "",
      specs: item.specs as Record<string, string>,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
      stock: item.product.stock,
    }));

    const totalAmount = items.reduce((sum: number, item: { subtotal: number }) => sum + item.subtotal, 0);

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
        { error: "Invalid product ID or quantity" },
        { status: 400 }
      );
    }

    // 获取或创建购物车
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;

    let cart;
    if (!cartId) {
      cart = await prisma.cart.create({
        data: {
          items: {
            create: {
              productId,
              quantity,
              specs: specs || {},
              price: 0, // 暂时设为0，后面会更新
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

      // 设置 cookie
      const response = NextResponse.json(formatCart(cart));
      response.cookies.set("cartId", cart.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 天
      });
      return response;
    }

    // 检查商品是否已存在
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
        specs: specs || {},
      },
    });

    if (existingItem) {
      // 更新数量
      cart = await prisma.cart.update({
        where: { id: cartId },
        data: {
          items: {
            update: {
              where: { id: existingItem.id },
              data: {
                quantity: existingItem.quantity + quantity,
              },
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
    } else {
      // 添加新商品
      cart = await prisma.cart.update({
        where: { id: cartId },
        data: {
          items: {
            create: {
              productId,
              quantity,
              specs: specs || {},
              price: 0,
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
    }

    return NextResponse.json(formatCart(cart));
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

// 格式化购物车数据
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatCart(cart: any) {
  if (!cart) {
    return { id: null, items: [], totalAmount: 0 };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = cart.items.map((item: any) => ({
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
