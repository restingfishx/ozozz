"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import type { Product, ProductSpec, Cart } from "@/types";

interface ProductDetailPageProps {
  params: { id: string };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter();
  const productId = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Image gallery state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  // Spec selection state
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({});

  // Quantity state
  const [quantity, setQuantity] = useState(1);

  // Cart state
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Get product ID from params
  // Fetch product data
  useEffect(() => {
    if (!productId) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);

        // Initialize spec selection with first option
        if (data.specs && data.specs.length > 0) {
          const initialSpecs: Record<string, string> = {};
          data.specs.forEach((spec: ProductSpec) => {
            if (spec.values && spec.values.length > 0) {
              initialSpecs[spec.name] = spec.values[0];
            }
          });
          setSelectedSpecs(initialSpecs);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load product";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  // Handle image zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  // Handle spec selection
  const handleSpecChange = (specName: string, value: string) => {
    setSelectedSpecs((prev) => ({
      ...prev,
      [specName]: value,
    }));
  };

  // Handle quantity change
  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + delta;
      return newQuantity >= 1 && newQuantity <= (product?.stock || 99) ? newQuantity : prev;
    });
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    setCartMessage(null);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          specs: selectedSpecs,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      const cartData: Cart = await response.json();

      setCartMessage({ type: "success", text: `Added ${quantity} item(s) to cart!` });

      // Dispatch custom event for cart update
      window.dispatchEvent(new CustomEvent("cart-updated", { detail: cartData }));
    } catch {
      setCartMessage({ type: "error", text: "Failed to add to cart. Please try again." });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Image skeleton */}
            <div className="space-y-4">
              <div className="aspect-square animate-pulse rounded-lg bg-bg-secondary" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 w-20 animate-pulse rounded-md bg-bg-secondary" />
                ))}
              </div>
            </div>
            {/* Info skeleton */}
            <div className="space-y-4">
              <div className="h-4 w-24 animate-pulse rounded bg-bg-secondary" />
              <div className="h-8 w-3/4 animate-pulse rounded bg-bg-secondary" />
              <div className="h-10 w-32 animate-pulse rounded bg-bg-secondary" />
              <div className="h-20 w-full animate-pulse rounded bg-bg-secondary" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-32">
          <div className="text-center">
            <h1 className="text-h2 font-semibold text-text-primary">Product Not Found</h1>
            <p className="mt-2 text-body text-text-secondary">{error || "The product you're looking for doesn't exist."}</p>
            <Link href="/products">
              <Button className="mt-6">Back to Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-small text-text-tertiary">
          <Link href="/" className="hover:text-text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-text-primary">
            Products
          </Link>
          <span>/</span>
          <span className="text-text-primary">{product.name}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <div className="mx-auto max-w-7xl px-4 pb-16 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg bg-bg-secondary",
                isZoomed && "cursor-zoom-out"
              )}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              onClick={() => isZoomed && setIsZoomed(false)}
            >
              {product.images && product.images.length > 0 ? (
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `url(${product.images[currentImageIndex]})`,
                    backgroundPosition: isZoomed ? `${zoomPosition.x}% ${zoomPosition.y}%` : "center",
                    backgroundSize: isZoomed ? "200%" : "cover",
                    backgroundRepeat: "no-repeat",
                    transition: isZoomed ? "background-size 0.1s" : "background-size 0.3s",
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-text-tertiary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="h-24 w-24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setIsZoomed(false);
                    }}
                    className={cn(
                      "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all",
                      currentImageIndex === index
                        ? "border-primary"
                        : "border-transparent hover:border-gray-300"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Category */}
            <p className="text-caption font-medium uppercase tracking-wider text-accent">
              {product.category}
            </p>

            {/* Product Name */}
            <h1 className="mt-2 text-h2 font-semibold text-text-primary md:text-h1">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-h2 font-semibold text-text-primary">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-text-tertiary line-through">
                    {formatPrice(product.originalPrice!)}
                  </span>
                  <span className="rounded-full bg-accent px-2 py-1 text-xs font-semibold text-white">
                    Save {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            {product.stock !== undefined && (
              <p className={cn(
                "mt-2 text-small",
                product.stock > 0 ? "text-success" : "text-error"
              )}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
            )}

            {/* Specifications */}
            {product.specs && product.specs.length > 0 && (
              <div className="mt-8 space-y-6">
                {product.specs.map((spec) => (
                  <div key={spec.name}>
                    <h3 className="text-small font-medium text-text-primary">{spec.name}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {spec.values.map((value) => (
                        <button
                          key={value}
                          onClick={() => handleSpecChange(spec.name, value)}
                          className={cn(
                            "min-w-[3rem] rounded-md border px-4 py-2 text-small font-medium transition-all",
                            selectedSpecs[spec.name] === value
                              ? "border-primary bg-primary text-white"
                              : "border-border bg-white text-text-primary hover:border-primary"
                          )}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mt-8">
              <h3 className="text-small font-medium text-text-primary">Quantity</h3>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center rounded-md border border-border">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="flex h-10 w-10 items-center justify-center text-text-primary transition-colors hover:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                    </svg>
                  </button>
                  <span className="w-12 text-center font-medium text-text-primary">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (product.stock || 99)}
                    className="flex h-10 w-10 items-center justify-center text-text-primary transition-colors hover:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Cart Message */}
            {cartMessage && (
              <div
                className={cn(
                  "mt-4 rounded-md px-4 py-3 text-small font-medium",
                  cartMessage.type === "success"
                    ? "bg-green-50 text-success"
                    : "bg-red-50 text-error"
                )}
              >
                {cartMessage.text}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <Button
                size="lg"
                onClick={handleAddToCart}
                loading={isAddingToCart}
                disabled={!product.stock || product.stock <= 0}
                className="flex-1"
              >
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="flex-1"
                onClick={async () => {
                  if (!product) return;
                  // Add to cart first, then checkout
                  try {
                    const response = await fetch("/api/cart", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        productId: product.id,
                        quantity,
                        specs: selectedSpecs,
                      }),
                    });
                    if (response.ok) {
                      router.push("/checkout");
                    }
                  } catch (error) {
                    console.error("Failed to add to cart:", error);
                  }
                }}
              >
                Buy Now
              </Button>
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="mt-12 border-t border-border pt-8">
                <h2 className="text-h3 font-semibold text-text-primary">Description</h2>
                <div className="mt-4 text-body text-text-secondary whitespace-pre-wrap">
                  {product.description}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
