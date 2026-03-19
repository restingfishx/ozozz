import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

async function getStats() {
  // Get total orders count
  const totalOrders = await prisma.order.count();

  // Get total sales (sum of all paid orders)
  const totalSalesResult = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },
    where: {
      status: {
        in: ["paid", "shipped", "completed"],
      },
    },
  });
  const totalSales = totalSalesResult._sum.totalAmount || 0;

  // Get pending orders count
  const pendingOrders = await prisma.order.count({
    where: {
      status: "pending",
    },
  });

  return {
    totalOrders,
    totalSales,
    pendingOrders,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-text-primary">
              {stats.totalOrders}
            </div>
            <p className="text-xs text-text-tertiary mt-1">View all orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-text-primary">
              {formatPrice(stats.totalSales)}
            </div>
            <p className="text-xs text-text-tertiary mt-1">Revenue overview</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-text-primary">
              {stats.pendingOrders}
            </div>
            <p className="text-xs text-text-tertiary mt-1">Orders awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/admin/products" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  Manage Products
                </Button>
              </Link>
              <Link href="/admin/products/new" className="block">
                <Button className="w-full justify-start">
                  Add New Product
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-tertiary text-sm">
              No recent activity
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
