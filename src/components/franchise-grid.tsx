"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, DollarSign } from "lucide-react";
import { FrontendFranchise } from "@/handler/FranchiseHandler";

interface FranchiseGridProps {
  franchises: FrontendFranchise[];
  favorites: number[];
  setFavorites: (value: number[]) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  viewMode: "grid" | "list";
}

export function FranchiseGrid({
  franchises,
  favorites,
  setFavorites,
  sortBy,
  setSortBy,
  viewMode,
}: FranchiseGridProps) {
  const toggleFavorite = (franchiseId: number) => {
    setFavorites(
      favorites.includes(franchiseId)
        ? favorites.filter((id) => id !== franchiseId)
        : [...favorites, franchiseId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Sort Controls */}
      <div className="flex items-center justify-between text-foreground">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="reviews">Most Reviews</option>
          </select>
        </div>
      </div>

      {/* Franchise Grid or List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            : "space-y-6"
        }
      >
        {franchises.map((franchise) => (
          <Card
            key={franchise.id}
            className={
              viewMode === "grid"
                ? "group hover:shadow-lg transition-shadow"
                : "group flex flex-col md:flex-row items-start hover:shadow-lg transition-shadow"
            }
          >
            <div
              className={
                viewMode === "grid" ? "relative" : "relative w-full md:w-1/3"
              }
            >
              <img
                src={franchise.coverImageUrl}
                alt={franchise.name}
                className={
                  viewMode === "grid"
                    ? "w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    : "w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                }
              />
              <div className="absolute top-3 left-3 flex gap-2">
                {franchise.isVerified && (
                  <Badge className="bg-green-100 text-green-700">
                    Verified
                  </Badge>
                )}
                <Badge
                  className={
                    franchise.status === "Active"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-200 text-gray-600"
                  }
                >
                  {franchise.status}
                </Badge>
              </div>
              <button
                onClick={() => toggleFavorite(franchise.id)}
                className="absolute top-3 right-3 p-2 bg-white/90 rounded-full"
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

            <CardContent className={viewMode === "grid" ? "p-6" : "p-6 flex-1"}>
              <h3 className="font-semibold text-lg">{franchise.name}</h3>
              <p className="text-sm text-gray-500">{franchise.legalEntity}</p>

              <p
                className="text-sm text-gray-600 mt-2 line-clamp-2"
                style={{ whiteSpace: "pre-line" }}
              >
                {franchise.description}
              </p>

              <div className="text-sm text-gray-600 mt-3">
                <MapPin className="w-4 h-4 inline mr-1" />
                {franchise.locations.join(", ")}
              </div>
              <div className="text-sm text-gray-600">
                <DollarSign className="w-4 h-4 inline mr-1" />$
                {franchise.startingPrice.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                Founded: {new Date(franchise.foundedIn).getFullYear()} |
                Outlets: {franchise.totalOutlets}
              </div>

              <div className="mt-3 text-sm text-gray-600">
                Reviews: {franchise.reviewsCount}
              </div>

              <div className="flex gap-2 mt-4">
                <Button asChild className="flex-1">
                  <a href={`/franchise/${franchise.id}`}>View Details</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
