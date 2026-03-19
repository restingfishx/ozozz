"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string | null;
  specs: Record<string, string> | null;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  orderNo: string;
  status: string;
  totalAmount: number;
  currency: string;
  trackingNumber: string | null;
  paidAt: string | null;
  shippedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  address: {
    name: string;
    phone: string;
    country: string;
    province: string;
    city: string;
    district: string;
    detail: string;
    postalCode: string;
  };
  items: OrderItem[];
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
        setTrackingNumber(data.trackingNumber || "");
        setNewStatus(data.status);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === order?.status) {
      setStatusModalOpen(false);
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        await fetchOrder();
        setStatusModalOpen(false);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateTracking = async () => {
    if (!trackingNumber) {
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/tracking`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumber }),
      });

      if (res.ok) {
        await fetchOrder();
        setTrackingModalOpen(false);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update tracking");
      }
    } catch (error) {
      console.error("Failed to update tracking:", error);
      alert("Failed to update tracking");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatAddress = (address: Order["address"]) => {
    if (!address) return "-";
    return [
      address.name,
      address.phone,
      address.detail,
      address.district,
      address.city,
      address.province,
      address.country,
      address.postalCode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <div className="text-text-secondary mb-4">Order not found</div>
        <Link href="/admin/orders">
          <Button variant="secondary">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm">
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold text-text-primary">
            Order {order.orderNo}
          </h1>
          <span
            className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
              statusColors[order.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {statusLabels[order.status] || order.status}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => setStatusModalOpen(true)}
          >
            Update Status
          </Button>
          <Button onClick={() => setTrackingModalOpen(true)}>
            {order.trackingNumber ? "Update Tracking" : "Add Tracking"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="w-20 h-20 bg-bg-secondary rounded-md overflow-hidden flex-shrink-0">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-tertiary text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-text-primary">
                      {item.productName}
                    </div>
                    {item.specs && Object.keys(item.specs).length > 0 && (
                      <div className="text-sm text-text-tertiary">
                        {Object.entries(item.specs)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")}
                      </div>
                    )}
                    <div className="text-sm text-text-secondary mt-1">
                      {item.quantity} x {formatAmount(item.price, order.currency)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-text-primary">
                      {formatAmount(item.subtotal, order.currency)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Order Timeline
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Created</span>
                <span className="text-sm text-text-primary">
                  {formatDate(order.createdAt)}
                </span>
              </div>
              {order.paidAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Paid</span>
                  <span className="text-sm text-text-primary">
                    {formatDate(order.paidAt)}
                  </span>
                </div>
              )}
              {order.shippedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Shipped</span>
                  <span className="text-sm text-text-primary">
                    {formatDate(order.shippedAt)}
                  </span>
                </div>
              )}
              {order.completedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Completed</span>
                  <span className="text-sm text-text-primary">
                    {formatDate(order.completedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Subtotal</span>
                <span className="text-text-primary">
                  {formatAmount(order.totalAmount, order.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Shipping</span>
                <span className="text-text-primary">Free</span>
              </div>
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="font-medium text-text-primary">Total</span>
                <span className="font-medium text-text-primary">
                  {formatAmount(order.totalAmount, order.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Shipping Address
            </h2>
            <p className="text-text-secondary whitespace-pre-line">
              {formatAddress(order.address)}
            </p>
          </div>

          {/* Tracking Info */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Tracking Information
            </h2>
            {order.trackingNumber ? (
              <div>
                <div className="text-sm text-text-secondary mb-1">
                  Tracking Number
                </div>
                <div className="font-medium text-text-primary">
                  {order.trackingNumber}
                </div>
              </div>
            ) : (
              <div className="text-text-tertiary">No tracking information</div>
            )}
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {statusModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Update Order Status
            </h3>
            <select
              className="w-full h-10 px-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setStatusModalOpen(false)}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus} disabled={updating}>
                {updating ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Number Modal */}
      {trackingModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              {order.trackingNumber ? "Update Tracking Number" : "Add Tracking Number"}
            </h3>
            <Input
              placeholder="Enter tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="mb-4"
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setTrackingModalOpen(false);
                  setTrackingNumber(order.trackingNumber || "");
                }}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateTracking} disabled={updating || !trackingNumber}>
                {updating ? "Updating..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
