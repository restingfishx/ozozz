"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductFilters } from "@/types";

interface SearchBarProps {
  filters: ProductFilters;
}

export default function SearchBar({ filters }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(filters.search || "");

  // Sync with URL params
  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("page", "1");
    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    }
    if (filters.category) {
      params.set("category", filters.category);
    }
    if (filters.minPrice) {
      params.set("minPrice", filters.minPrice.toString());
    }
    if (filters.maxPrice) {
      params.set("maxPrice", filters.maxPrice.toString());
    }
    if (filters.sort) {
      params.set("sort", filters.sort);
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleClear = () => {
    setSearchValue("");
    const params = new URLSearchParams();
    params.set("page", "1");
    if (filters.category) {
      params.set("category", filters.category);
    }
    if (filters.minPrice) {
      params.set("minPrice", filters.minPrice.toString());
    }
    if (filters.maxPrice) {
      params.set("maxPrice", filters.maxPrice.toString());
    }
    if (filters.sort) {
      params.set("sort", filters.sort);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="搜索商品..."
            className="w-full px-4 py-2.5 pl-10 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors"
        >
          搜索
        </button>
        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-2.5 text-sm text-text-secondary hover:text-primary transition-colors"
          >
            清除
          </button>
        )}
      </div>
    </form>
  );
}
