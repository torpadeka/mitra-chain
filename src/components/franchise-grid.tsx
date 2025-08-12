"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MapPin,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import Link from "next/link";

const franchises = [
  {
    id: "1",
    name: "Green Leaf Cafe",
    industry: "Food & Beverage",
    location: "North America",
    investment: { min: 150000, max: 300000 },
    rating: 4.8,
    reviews: 124,
    image: "/cafe-franchise.png",
    description:
      "Sustainable coffee shop franchise with organic, locally-sourced ingredients.",
    features: ["Training Provided", "Financing Available", "Ongoing Support"],
    trending: true,
    verified: true,
  },
  {
    id: "2",
    name: "FitZone Gym",
    industry: "Health & Fitness",
    location: "North America",
    investment: { min: 250000, max: 500000 },
    rating: 4.6,
    reviews: 89,
    image: "/gym-franchise.png",
    description:
      "Modern fitness center franchise with state-of-the-art equipment and personal training.",
    features: ["Training Provided", "Marketing Support"],
    trending: false,
    verified: true,
  },
  {
    id: "3",
    name: "TechKids Academy",
    industry: "Education",
    location: "Global",
    investment: { min: 75000, max: 150000 },
    rating: 4.9,
    reviews: 156,
    image: "/education-franchise.png",
    description:
      "STEM education franchise teaching coding and robotics to children aged 6-16.",
    features: ["Training Provided", "Curriculum Included", "Ongoing Support"],
    trending: true,
    verified: true,
  },
  {
    id: "4",
    name: "AutoCare Pro",
    industry: "Automotive",
    location: "North America",
    investment: { min: 200000, max: 400000 },
    rating: 4.5,
    reviews: 67,
    image: "/auto-franchise.png",
    description:
      "Full-service automotive repair and maintenance franchise with certified technicians.",
    features: ["Training Provided", "Equipment Included"],
    trending: false,
    verified: true,
  },
  {
    id: "5",
    name: "CleanHome Services",
    industry: "Home Services",
    location: "North America",
    investment: { min: 50000, max: 100000 },
    rating: 4.7,
    reviews: 203,
    image: "/cleaning-franchise.png",
    description:
      "Residential and commercial cleaning service franchise with eco-friendly products.",
    features: ["Low Investment", "Training Provided", "Marketing Support"],
    trending: false,
    verified: true,
  },
  {
    id: "6",
    name: "Fashion Forward",
    industry: "Retail",
    location: "Europe",
    investment: { min: 100000, max: 250000 },
    rating: 4.4,
    reviews: 78,
    image: "/fashion-franchise.png",
    description:
      "Contemporary fashion retail franchise targeting young professionals and students.",
    features: ["Inventory Support", "Training Provided"],
    trending: true,
    verified: true,
  },
];

export function FranchiseGrid() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");

  const toggleFavorite = (franchiseId: string) => {
    setFavorites((prev) =>
      prev.includes(franchiseId)
        ? prev.filter((id) => id !== franchiseId)
        : [...prev, franchiseId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          >
            <option value="featured">Featured</option>
            <option value="investment-low">Investment: Low to High</option>
            <option value="investment-high">Investment: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Franchise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {franchises.map((franchise) => (
          <Card
            key={franchise.id}
            className="group hover:shadow-lg transition-shadow border-gray-200 overflow-hidden"
          >
            <div className="relative">
              <img
                src={franchise.image || "/placeholder.svg?height=200&width=400"}
                alt={franchise.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                {franchise.trending && (
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                )}
                {franchise.verified && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Verified
                  </Badge>
                )}
              </div>
              <button
                onClick={() => toggleFavorite(franchise.id)}
                className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${
                    favorites.includes(franchise.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600"
                  }`}
                />
              </button>
            </div>

            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-serif font-semibold text-lg text-gray-900 mb-1">
                    {franchise.name}
                  </h3>
                  <p className="text-sm text-green-600 font-medium">
                    {franchise.industry}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900">
                    {franchise.rating}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({franchise.reviews})
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {franchise.description}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {franchise.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2 text-gray-400" />$
                  {franchise.investment.min.toLocaleString()} - $
                  {franchise.investment.max.toLocaleString()}
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {franchise.features.slice(0, 2).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {franchise.features.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{franchise.features.length - 2} more
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button asChild className="flex-1 btn-primary">
                  <a href={`/franchise/${franchise.id}`}>View Details</a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3 bg-transparent"
                >
                  <Users className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-8">
        <Button variant="outline" className="px-8 py-3 bg-transparent">
          <Clock className="w-4 h-4 mr-2" />
          Load More Franchises
        </Button>
      </div>
    </div>
  );
}
