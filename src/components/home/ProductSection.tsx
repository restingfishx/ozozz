import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

export function ProductSection({ title, products, viewAllLink }: ProductSectionProps) {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between md:mb-12">
          <div>
            <h2 className="text-h2-mobile font-semibold text-text-primary md:text-h2">
              {title}
            </h2>
          </div>
          {viewAllLink && (
            <Link href={viewAllLink} className="hidden md:block">
              <Button variant="ghost" size="sm">
                View All
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="ml-1 h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </Button>
            </Link>
          )}
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-body text-text-secondary">No products available yet.</p>
          </div>
        )}

        {/* Mobile View All Button */}
        {viewAllLink && (
          <div className="mt-8 text-center md:hidden">
            <Link href={viewAllLink}>
              <Button variant="secondary" className="w-full">
                View All
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
