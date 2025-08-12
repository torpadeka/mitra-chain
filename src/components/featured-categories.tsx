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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4">
            Explore Franchise Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                className="group hover:shadow-lg transition-shadow cursor-pointer border-gray-200 hover:border-green-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <IconComponent className="w-6 h-6 text-green-600" />
                    </div>
                    {category.trending && (
                      <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                        Trending
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{category.description}</p>
                  <p className="text-sm text-green-600 font-medium">
                    {category.count}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button className="btn-primary text-lg px-8 py-4">
            View All Categories
          </Button>
        </div>
      </div>
    </section>
  );
}
