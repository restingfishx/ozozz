"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  status: "active" | "inactive";
  specs: { name: string; values: string[] }[];
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; productId: string | null }>({
    open: false,
    productId: null,
  });

  const fetchProducts = async (pageNum: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", pageNum.toString());
      params.set("limit", "10");
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data: ProductsResponse = await res.json();
      setProducts(data.data);
      setTotal(data.total);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = () => {
    fetchProducts(1);
  };

  const handleStatusToggle = async (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`/api/admin/products/${productId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchProducts(page);
      }
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.productId) return;
    try {
      const res = await fetch(`/api/admin/products/${deleteModal.productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteModal({ open: false, productId: null });
        fetchProducts(page);
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">Products</h1>
        <Link href="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-border p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <select
            className="h-10 px-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              fetchProducts(1);
            }}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button onClick={handleSearch} variant="secondary">
            Search
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-secondary">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Stock
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-secondary">
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-secondary">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-bg-secondary">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-bg-secondary rounded-md overflow-hidden flex-shrink-0">
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-tertiary text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-text-primary truncate max-w-[200px]">
                            {product.name}
                          </div>
                          {product.description && (
                            <div className="text-sm text-text-tertiary truncate max-w-[200px]">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {product.category || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-text-primary">
                        ${product.price.toFixed(2)}
                      </div>
                      {product.originalPrice && (
                        <div className="text-sm text-text-tertiary line-through">
                          ${product.originalPrice.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.id}`}>
                          <Button size="sm" variant="ghost">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStatusToggle(product.id, product.status)}
                        >
                          {product.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-error hover:text-error"
                          onClick={() => setDeleteModal({ open: true, productId: product.id })}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-border">
            <div className="text-sm text-text-secondary">
              Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of{" "}
              {total} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                disabled={page === 1}
                onClick={() => fetchProducts(page - 1)}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={page === totalPages}
                onClick={() => fetchProducts(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Confirm Delete
            </h3>
            <p className="text-text-secondary mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setDeleteModal({ open: false, productId: null })}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
