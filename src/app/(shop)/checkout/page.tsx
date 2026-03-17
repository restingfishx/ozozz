'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AddressForm, AddressFormData } from '@/components/checkout/AddressForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  specs: Record<string, string>;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Cart {
  id: string | null;
  items: CartItem[];
  totalAmount: number;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart>({ id: null, items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

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

  const handleAddressSubmit = async (address: AddressFormData) => {
    if (!cart.id) {
      setError('购物车为空，无法提交订单');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId: cart.id,
          address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '订单创建失败');
      }

      // 订单创建成功，清空购物车并跳转或显示成功
      setOrderSuccess(true);

      // 如果有支付链接，跳转到支付
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '订单创建失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  // 购物车为空
  if (cart.items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">购物车为空</h2>
          <p className="text-gray-500 mb-6">请先添加商品到购物车</p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            去购物
          </Link>
        </div>
      </div>
    );
  }

  // 订单成功
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">订单提交成功</h2>
          <p className="text-gray-500 mb-6">您的订单已成功提交</p>
          <Link
            href="/orders"
            className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            查看订单
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">结算</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：收货地址 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <AddressForm onSubmit={handleAddressSubmit} />

              <div className="mt-6 pt-6 border-t">
                <button
                  type="submit"
                  onClick={() => {
                    const form = document.querySelector('form');
                    if (form) {
                      form.dispatchEvent(new Event('submit', { bubbles: true }));
                    }
                  }}
                  disabled={submitting}
                  className="w-full h-12 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? '提交中...' : '提交订单'}
                </button>
              </div>
            </div>
          </div>

          {/* 右侧：订单摘要 */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <OrderSummary items={cart.items} totalAmount={cart.totalAmount} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
