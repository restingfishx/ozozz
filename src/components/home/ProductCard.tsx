import Link from "next/link";
import Image from "next/image";
import { cn, formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn("group block", className)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-bg-secondary">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-tertiary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="h-12 w-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-1 text-xs font-semibold text-white">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-4">
        {/* Category Tag */}
        <p className="text-caption font-medium uppercase tracking-wider text-accent">
          {product.category}
        </p>

        {/* Product Name */}
        <h3 className="mt-1 line-clamp-2 text-h3-mobile font-semibold text-text-primary transition-colors group-hover:text-primary md:text-h3">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-body font-semibold text-text-primary md:text-lg">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-small text-text-tertiary line-through">
              {formatPrice(product.originalPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
