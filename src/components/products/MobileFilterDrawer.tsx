"use client";

import { useState } from "react";
import { ProductFilters } from "@/types";

interface MobileFilterDrawerProps {
  categories: string[];
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileFilterDrawer({
  categories,
  filters,
  onFilterChange,
  isOpen,
  onClose,
}: MobileFilterDrawerProps) {
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || "",
    max: filters.maxPrice || "",
  });

  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? undefined : category,
      page: 1,
    });
  };

  const handlePriceChange = () => {
    onFilterChange({
      ...filters,
      minPrice: priceRange.min ? Number(priceRange.min) : undefined,
      maxPrice: priceRange.max ? Number(priceRange.max) : undefined,
      page: 1,
    });
  };

  const handleSortChange = (sort: ProductFilters["sort"]) => {
    onFilterChange({
      ...filters,
      sort,
      page: 1,
    });
  };

  const clearFilters = () => {
    setPriceRange({ min: "", max: "" });
    onFilterChange({
      sort: filters.sort,
      page: 1,
    });
  };

  const hasActiveFilters =
    filters.category || filters.minPrice || filters.maxPrice;

  const sortOptions = [
    { value: "newest", label: "最新" },
    { value: "price_asc", label: "价格：从低到高" },
    { value: "price_desc", label: "价格：从高到低" },
    { value: "sales", label: "销量优先" },
  ] as const;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border-light px-4 py-3 flex items-center justify-between">
          <h3 className="font-medium">筛选</h3>
          <button onClick={onClose} className="p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Sort */}
          <div>
            <h4 className="text-sm font-medium mb-3">排序</h4>
            <select
              value={filters.sort || "newest"}
              onChange={(e) => handleSortChange(e.target.value as ProductFilters["sort"])}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary bg-white"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <h4 className="text-sm font-medium mb-3">分类</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    filters.category === category
                      ? "bg-primary text-white border-primary"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <h4 className="text-sm font-medium mb-3">价格区间</h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="最低"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: e.target.value })
                }
                onBlur={handlePriceChange}
                className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              />
              <span className="text-text-tertiary">-</span>
              <input
                type="number"
                placeholder="最高"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: e.target.value })
                }
                onBlur={handlePriceChange}
                className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex-1 py-2.5 text-sm border border-border rounded-lg hover:border-primary transition-colors"
              >
                清除筛选
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
            >
              应用
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
