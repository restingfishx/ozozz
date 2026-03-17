"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product, ProductFilters, ProductsResponse, CategoriesResponse } from "@/types";
import FilterSidebar from "./FilterSidebar";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import MobileFilterDrawer from "./MobileFilterDrawer";

export default function ProductsList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Parse filters from URL
  const filters: ProductFilters = {
    category: searchParams.get("category") || undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    sort: (searchParams.get("sort") as ProductFilters["sort"]) || "newest",
    search: searchParams.get("search") || undefined,
    page: Number(searchParams.get("page")) || 1,
  };

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data: CategoriesResponse = await res.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.category) params.set("category", filters.category);
        if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
        if (filters.sort) params.set("sort", filters.sort);
        if (filters.search) params.set("search", filters.search);
        params.set("page", (filters.page || 1).toString());
        params.set("limit", "12");

        const res = await fetch(`/api/products?${params.toString()}`);
        const data: ProductsResponse = await res.json();

        setProducts(data.data || []);
        setPagination({
          page: data.page,
          total: data.total,
          totalPages: data.totalPages,
        });
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const handleFilterChange = (newFilters: ProductFilters) => {
    const params = new URLSearchParams();
    if (newFilters.page) params.set("page", newFilters.page.toString());
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice.toString());
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice.toString());
    if (newFilters.sort) params.set("sort", newFilters.sort);
    if (newFilters.search) params.set("search", newFilters.search);

    router.push(`/products?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    handleFilterChange({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-white border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <nav className="text-sm text-text-tertiary mb-4">
            <ol className="flex items-center gap-1">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  首页
                </a>
              </li>
              <li>/</li>
              <li className="text-text-secondary">商品列表</li>
            </ol>
          </nav>

          {/* Title & Search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-semibold">全部商品</h1>
            <SearchBar filters={filters} />
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden mt-4 flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            筛选
            {(filters.category || filters.minPrice || filters.maxPrice) && (
              <span className="w-2 h-2 bg-accent rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Active Filters */}
            {(filters.category || filters.search) && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {filters.search && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-bg-secondary text-sm rounded-full">
                    关键词: {filters.search}
                    <button
                      onClick={() =>
                        handleFilterChange({ ...filters, search: undefined, page: 1 })
                      }
                      className="ml-1 hover:text-error"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {filters.category && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-bg-secondary text-sm rounded-full">
                    分类: {filters.category}
                    <button
                      onClick={() =>
                        handleFilterChange({ ...filters, category: undefined, page: 1 })
                      }
                      className="ml-1 hover:text-error"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Results Count */}
            <p className="text-sm text-text-secondary mb-4">
              共 {pagination.total} 件商品
            </p>

            {/* Loading */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-bg-secondary aspect-square rounded-xl mb-3" />
                    <div className="h-3 bg-bg-secondary rounded w-1/3 mb-2" />
                    <div className="h-4 bg-bg-secondary rounded w-3/4 mb-2" />
                    <div className="h-4 bg-bg-secondary rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-text-tertiary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-text-secondary">没有找到相关商品</p>
                <button
                  onClick={() => router.push("/products")}
                  className="mt-4 text-primary hover:underline"
                >
                  清除筛选条件
                </button>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        categories={categories}
        filters={filters}
        onFilterChange={handleFilterChange}
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      />
    </div>
  );
}
