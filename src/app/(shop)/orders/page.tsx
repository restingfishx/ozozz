'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  specs: Record<string, string>;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Address {
  name: string;
  phone: string;
  country: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  postalCode: string;
}

interface Order {
  id: string;
  orderNo: string;
  status: string;
  items: OrderItem[];
  address: Address;
  totalAmount: number;
  paidAt?: string;
  shippedAt?: string;
  trackingNumber?: string;
  createdAt: string;
}

// Status mapping
const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending Payment', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Paid', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">You have no orders yet</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = statusMap[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' };
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <span className="text-sm text-gray-500">Order No.</span>
                        <p className="font-medium">{order.orderNo}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Order Date</span>
                        <p className="font-medium">{formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Status</span>
                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/orders/${order.id}`}
                      className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                    >
                      View Details
                    </Link>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
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
                            <p className="text-sm text-gray-500 mt-1">
                              ${item.price} x {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${item.subtotal.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Total */}
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <div className="text-right">
                        <span className="text-gray-500">Total: </span>
                        <span className="text-xl font-bold">${order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
