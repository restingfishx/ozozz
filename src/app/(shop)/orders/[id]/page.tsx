'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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

function formatDate(dateString?: string): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as string);
    }
  }, [params.id]);

  const fetchOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to fetch order');
        return;
      }
      const data = await res.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to fetch order');
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

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error || 'Order not found'}</p>
        <Link href="/orders" className="text-blue-600 hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const status = statusMap[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' };
  const address = order.address as unknown as Address;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link href="/orders" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Orders
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Order {order.orderNo}</h1>
              <p className="text-gray-500">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Payment Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${order.status !== 'pending' && order.status !== 'cancelled' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div>
                <p className="font-medium">Payment</p>
                <p className="text-sm text-gray-500">
                  {order.status === 'pending' ? 'Awaiting payment' :
                   order.status === 'cancelled' ? 'Payment cancelled' :
                   order.paidAt ? `Paid on ${formatDate(order.paidAt)}` : 'Paid'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${order.status === 'shipped' || order.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div>
                <p className="font-medium">Shipment</p>
                <p className="text-sm text-gray-500">
                  {order.status === 'shipped' || order.status === 'completed'
                    ? order.shippedAt ? `Shipped on ${formatDate(order.shippedAt)}` : 'Shipped'
                    : order.status === 'completed' ? 'Delivered' : 'Not shipped yet'}
                </p>
              </div>
            </div>
          </div>

          {/* Tracking Number */}
          {order.trackingNumber && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Tracking Number</p>
              <p className="font-medium">{order.trackingNumber}</p>
            </div>
          )}
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
          {address ? (
            <div>
              <p className="font-medium">{address.name}</p>
              <p className="text-gray-500">{address.phone}</p>
              <p className="text-gray-500 mt-1">
                {address.detail}, {address.district}, {address.city}, {address.province}, {address.postalCode}
              </p>
              <p className="text-gray-500">{address.country}</p>
            </div>
          ) : (
            <p className="text-gray-500">No shipping address</p>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          <div className="divide-y">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
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

          {/* Order Summary */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between py-2 border-t font-bold text-lg">
                  <span>Total</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
