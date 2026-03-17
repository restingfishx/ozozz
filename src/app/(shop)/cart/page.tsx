'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  specs: Record<string, string>;
  price: number;
  quantity: number;
  subtotal: number;
  stock?: number;
}

interface Cart {
  id: string | null;
  items: CartItem[];
  totalAmount: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart>({ id: null, items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">购物车</h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">购物车是空的</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              去购物
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 商品列表 */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm p-4 flex gap-4"
                >
                  <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                    {item.productImage && (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    {item.specs && Object.keys(item.specs).length > 0 && (
                      <p className="text-sm text-gray-500">
                        {Object.entries(item.specs)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(', ')}
                      </p>
                    )}
                    <p className="text-lg font-medium mt-2">¥{item.price}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      ×
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 border rounded hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 border rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-medium">¥{item.subtotal}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 结算 */}
            <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-4">
              <h2 className="text-lg font-semibold mb-4">订单总结</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">商品总数</span>
                  <span>{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                  <span>合计</span>
                  <span>¥{cart.totalAmount}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block w-full py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700"
              >
                去结算
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
