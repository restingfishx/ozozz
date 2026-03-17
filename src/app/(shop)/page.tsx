import { Banner } from "@/components/home/Banner";
import { CategorySection } from "@/components/home/CategorySection";
import { ProductSection } from "@/components/home/ProductSection";

// Mock data for development - in production, these would come from API
const mockBestSellers = [
  {
    id: "1",
    name: "Premium Silk Eye Mask",
    price: 29.99,
    originalPrice: 39.99,
    images: ["https://images.unsplash.com/photo-1520038410233-7141be7e6f97?w=800&h=600&fit=crop"],
    category: "Eye Masks",
  },
  {
    id: "2",
    name: "Contoured Sleep Mask",
    price: 24.99,
    images: ["https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop"],
    category: "Eye Masks",
  },
  {
    id: "3",
    name: "Travel Sleep Set",
    price: 34.99,
    originalPrice: 44.99,
    images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"],
    category: "Accessories",
  },
  {
    id: "4",
    name: "Lavender Eye Pillow",
    price: 19.99,
    images: ["https://images.unsplash.com/photo-1520038410233-7141be7e6f97?w=800&h=600&fit=crop"],
    category: "Sleep Essentials",
  },
];

const mockNewArrivals = [
  {
    id: "5",
    name: "Cooling Gel Eye Mask",
    price: 32.99,
    images: ["https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop"],
    category: "Eye Masks",
  },
  {
    id: "6",
    name: "Bamboo Fiber Sleep Set",
    price: 44.99,
    images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"],
    category: "Sleep Essentials",
  },
  {
    id: "7",
    name: "Wireless Sleep Headphones",
    price: 59.99,
    originalPrice: 79.99,
    images: ["https://images.unsplash.com/photo-1520038410233-7141be7e6f97?w=800&h=600&fit=crop"],
    category: "Accessories",
  },
  {
    id: "8",
    name: "Silk Sleep Cap",
    price: 22.99,
    images: ["https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop"],
    category: "Accessories",
  },
];

export default async function HomePage() {
  // In production, fetch from API:
  // const bestSellers = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?sort=sales&limit=4`).then(res => res.json());
  // const newArrivals = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?sort=newest&limit=4`).then(res => res.json());

  // Using mock data for development
  const bestSellers = mockBestSellers;
  const newArrivals = mockNewArrivals;

  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <Banner />

      {/* Categories */}
      <CategorySection />

      {/* Best Sellers */}
      <ProductSection
        title="Best Sellers"
        products={bestSellers}
        viewAllLink="/products?sort=sales"
      />

      {/* New Arrivals */}
      <ProductSection
        title="New Arrivals"
        products={newArrivals}
        viewAllLink="/products?sort=newest"
      />
    </div>
  );
}
