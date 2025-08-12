"use client";

import { FeaturedCategories } from "@/components/featured-categories";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Testimonials } from "@/components/testimonials";

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <Testimonials />
      <Footer />
    </div>
  );
}
