import { Suspense } from "react";
import ProductsList from "@/components/products/ProductsList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products - Ozozz",
  description: "Browse all our products",
};

function ProductsListFallback() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="bg-white border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="h-6 bg-bg-secondary rounded w-32 mb-4 animate-pulse" />
          <div className="h-8 bg-bg-secondary rounded w-48 animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
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
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsListFallback />}>
      <ProductsList />
    </Suspense>
  );
}
