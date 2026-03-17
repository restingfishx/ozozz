import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  imageAlt: string;
}

const defaultCategories: Category[] = [
  {
    id: "1",
    name: "Eye Masks",
    slug: "eye-masks",
    image: "https://images.unsplash.com/photo-1520038410233-7141be7e6f97?w=600&h=600&fit=crop",
    imageAlt: "Premium eye masks",
  },
  {
    id: "2",
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=600&fit=crop",
    imageAlt: "Comfortable accessories",
  },
  {
    id: "3",
    name: "Sleep Essentials",
    slug: "sleep-essentials",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
    imageAlt: "Sleep essentials",
  },
];

interface CategorySectionProps {
  categories?: Category[];
}

export function CategorySection({ categories = defaultCategories }: CategorySectionProps) {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-8 text-center md:mb-12">
          <h2 className="text-h2-mobile font-semibold text-text-primary md:text-h2">
            Shop by Category
          </h2>
          <p className="mt-2 text-body text-text-secondary md:text-lg">
            Find the perfect product for your needs
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group relative aspect-square overflow-hidden rounded-lg bg-bg-secondary"
            >
              <Image
                src={category.image}
                alt={category.imageAlt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="text-h3-mobile font-semibold text-white md:text-h3">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
