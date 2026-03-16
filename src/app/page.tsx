import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-border-light z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            Ozozz
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/products" className="text-text-secondary hover:text-primary transition-colors">
              Products
            </Link>
            <Link href="/cart" className="text-text-secondary hover:text-primary transition-colors">
              Cart
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 pt-16">
        <section className="h-[500px] flex items-center justify-center bg-bg-secondary">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-primary mb-4">
              Premium Sleep & Lifestyle
            </h1>
            <p className="text-xl text-text-secondary mb-8">
              Discover our collection of beautifully designed products for better sleep
            </p>
            <Link href="/products">
              <Button size="lg">Shop Now</Button>
            </Link>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-3 gap-6">
            <Link href="/products?category=eyemasks" className="aspect-square bg-bg-secondary rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
              <span className="text-lg font-medium">Eye Masks</span>
            </Link>
            <Link href="/products?category=accessories" className="aspect-square bg-bg-secondary rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
              <span className="text-lg font-medium">Accessories</span>
            </Link>
            <Link href="/products?category=new" className="aspect-square bg-accent text-white rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity">
              <span className="text-lg font-medium">New Arrivals</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-text-secondary">
          <p>&copy; 2025 Ozozz. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
