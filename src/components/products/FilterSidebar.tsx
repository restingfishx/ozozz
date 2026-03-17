"use client";

import { useState } from "react";
import { ProductFilters } from "@/types";

interface FilterSidebarProps {
  categories: string[];
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
}

export default function FilterSidebar({
  categories,
  filters,
  onFilterChange,
}: FilterSidebarProps) {
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

  return (
    <aside className="w-full lg:w-60 flex-shrink-0">
      <div className="bg-white rounded-lg border border-border-light p-4">
        {/* Sort */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-text-primary mb-3">排序</h3>
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

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-text-primary mb-3">分类</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.category === category}
                  onChange={() => handleCategoryChange(category)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-text-primary mb-3">价格区间</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="最低"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: e.target.value })
              }
              onBlur={handlePriceChange}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
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
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full py-2 text-sm text-text-secondary hover:text-primary transition-colors border border-border rounded-lg hover:border-primary"
          >
            清除筛选
          </button>
        )}
      </div>
    </aside>
  );
}
