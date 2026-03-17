import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-primary">
              Ozozz
            </Link>
            <p className="mt-4 text-small text-text-secondary">
              Premium sleep & lifestyle products designed for the modern Z-generation.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-h3 font-semibold text-text-primary">Shop</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-small text-text-secondary transition-colors hover:text-primary"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=eye-masks"
                  className="text-small text-text-secondary transition-colors hover:text-primary"
                >
                  Eye Masks
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=accessories"
                  className="text-small text-text-secondary transition-colors hover:text-primary"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-h3 font-semibold text-text-primary">Support</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/orders"
                  className="text-small text-text-secondary transition-colors hover:text-primary"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-small text-text-secondary transition-colors hover:text-primary"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-small text-text-secondary transition-colors hover:text-primary"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-h3 font-semibold text-text-primary">Legal</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-small text-text-secondary transition-colors hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-small text-text-secondary transition-colors hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-small text-text-secondary transition-colors hover:text-primary"
                >
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-small text-text-tertiary">
            &copy; {new Date().getFullYear()} Ozozz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
