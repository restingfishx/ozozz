"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface BannerSlide {
  id: string;
  image: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

const defaultBanners: BannerSlide[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1520038410233-7141be7e6f97?w=1920&h=800&fit=crop",
    imageAlt: "Premium sleep masks collection",
    title: "Discover Better Sleep",
    subtitle: "Premium eye masks designed for deep, restorative rest",
    ctaText: "Shop Now",
    ctaLink: "/products",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&h=800&fit=crop",
    imageAlt: "Comfortable accessories",
    title: "Elevate Your Comfort",
    subtitle: "Premium accessories for your daily wellness routine",
    ctaText: "Explore Collection",
    ctaLink: "/products?category=accessories",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=800&fit=crop",
    imageAlt: "New arrivals",
    title: "New Arrivals",
    subtitle: "Latest additions to our collection",
    ctaText: "View New",
    ctaLink: "/products?sort=newest",
  },
];

interface BannerProps {
  slides?: BannerSlide[];
}

export function Banner({ slides = defaultBanners }: BannerProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="relative">
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className="relative min-w-0 flex-[0_0_100%]">
              {/* Banner Image */}
              <div className="relative h-[400px] w-full md:h-[500px] lg:h-[600px]">
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30" />
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                  <h1 className="text-h1-mobile font-semibold text-white md:text-h1">
                    {slide.title}
                  </h1>
                  <p className="mt-4 max-w-md text-body text-white/90 md:text-lg">
                    {slide.subtitle}
                  </p>
                  <Link href={slide.ctaLink} className="mt-8">
                    <Button size="lg" variant="primary">
                      {slide.ctaText}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md transition-colors hover:bg-white"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md transition-colors hover:bg-white"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className="h-2 w-2 rounded-full bg-white/50 transition-colors hover:bg-white/80 data-[active=true]:bg-white"
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
