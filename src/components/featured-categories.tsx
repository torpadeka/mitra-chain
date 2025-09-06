import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Coffee,
  Utensils,
  Dumbbell,
  GraduationCap,
  Car,
  Home,
} from "lucide-react";

const categories = [
  {
    icon: Coffee,
    title: "Food & Beverage",
    description: "Restaurants, cafes, and food services",
    count: "120+ franchises",
    trending: true,
  },
  {
    icon: Dumbbell,
    title: "Health & Fitness",
    description: "Gyms, wellness centers, and health services",
    count: "85+ franchises",
    trending: false,
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Learning centers, tutoring, and training",
    count: "65+ franchises",
    trending: true,
  },
  {
    icon: Car,
    title: "Automotive",
    description: "Car services, repairs, and maintenance",
    count: "45+ franchises",
    trending: false,
  },
  {
    icon: Home,
    title: "Home Services",
    description: "Cleaning, maintenance, and home improvement",
    count: "90+ franchises",
    trending: false,
  },
  {
    icon: Utensils,
    title: "Retail",
    description: "Stores, boutiques, and specialty retail",
    count: "75+ franchises",
    trending: true,
  },
];

export function FeaturedCategories() {
  return (
    <section className="min-h-screen py-20 bg-neutral-50 bg-gradient-to-b from-background/88 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-sans font-bold text-3xl md:text-4xl text-neutral-900 mb-4 text-balance">
            Explore Franchise Categories
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto text-pretty">
            Discover opportunities across diverse industries with verified
            franchisors and transparent investment details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-background dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-brand-400 hover:shadow-brand-200/20"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-brand-400 rounded-lg flex items-center justify-center group-hover:bg-brand-200 dark:group-hover:bg-brand-800 transition-colors">
                      <IconComponent className="w-6 h-6 text-brand-800 dark:text-brand-400" />
                    </div>
                    {category.trending && (
                      <span className="bg-brand-400 text-brand-800 text-xs font-medium px-2 py-1 rounded-full font-jetbrains-mono">
                        Trending
                      </span>
                    )}
                  </div>
                  <h3 className="font-sans font-semibold text-xl text-neutral-900 dark:text-neutral-100 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-3 leading-relaxed">
                    {category.description}
                  </p>
                  <p className="text-sm text-brand-600 dark:text-brand-400 font-medium font-jetbrains-mono">
                    {category.count}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button variant={"primary"} size={"lg"}>
            View All Categories
          </Button>
        </div>
      </div>
    </section>
  );
}
