'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
const statusMap: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'info' | 'error' }> = {
  pending: { label: 'Pending Payment', variant: 'warning' },
  paid: { label: 'Paid', variant: 'info' },
  shipped: { label: 'Shipped', variant: 'default' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'error' },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
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
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-tertiary mb-4">You have no orders yet</p>
            <Link href="/products">
              <Button>Shop Now</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = statusMap[order.status] || { label: order.status, variant: 'default' as const };
              return (
                <div key={order.id} className="bg-card rounded-lg shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-bg-secondary px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <span className="text-sm text-text-tertiary">Order No.</span>
                        <p className="font-medium text-text-primary">{order.orderNo}</p>
                      </div>
                      <div>
                        <span className="text-sm text-text-tertiary">Order Date</span>
                        <p className="font-medium text-text-primary">{formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-text-tertiary">Status</span>
                        <div className="mt-1">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            status.variant === 'success' ? 'bg-success/10 text-success' :
                            status.variant === 'warning' ? 'bg-warning/10 text-warning' :
                            status.variant === 'error' ? 'bg-error/10 text-error' :
                            status.variant === 'info' ? 'bg-info/10 text-info' :
                            'bg-gray-100 text-text-secondary'
                          }`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="secondary" size="sm">View Details</Button>
                    </Link>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-20 h-20 bg-bg-secondary rounded-md overflow-hidden flex-shrink-0">
                            {item.productImage && (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-text-primary">{item.productName}</h3>
                            {item.specs && Object.keys(item.specs).length > 0 && (
                              <p className="text-sm text-text-tertiary">
                                {Object.entries(item.specs)
                                  .map(([k, v]) => `${k}: ${v}`)
                                  .join(', ')}
                              </p>
                            )}
                            <p className="text-sm text-text-secondary mt-1">
                              {formatPrice(item.price)} x {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-text-primary">{formatPrice(item.subtotal)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Total */}
                    <div className="mt-4 pt-4 border-t border-border flex justify-end">
                      <div className="text-right">
                        <span className="text-text-secondary">Total: </span>
                        <span className="text-xl font-bold text-text-primary">{formatPrice(order.totalAmount)}</span>
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
