"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, MapPin, DollarSign, ChevronDown } from "lucide-react";
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
          <span className="text-sm text-neutral-600">Sort by:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-sm px-3 py-1">
                {sortBy === "featured"
                  ? "Featured"
                  : sortBy === "price-low"
                    ? "Price: Low to High"
                    : sortBy === "price-high"
                      ? "Price: High to Low"
                      : "Most Reviews"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setSortBy("featured")}>
                Featured
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSortBy("price-low")}>
                Price: Low to High
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSortBy("price-high")}>
                Price: High to Low
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSortBy("reviews")}>
                Most Reviews
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                ? "group hover:shadow-lg transition-shadow shadow-neutral-200"
                : "group flex flex-col md:flex-row items-start hover:shadow-lg transition-shadow"
            }
          >
            <div
              className={
                viewMode === "grid" ? "relative" : "relative w-full md:w-1/3"
              }
            >
              <img
                src={franchise.coverImageUrl || "https://picsum.photos/300/200"}
                alt={franchise.name}
                className={
                  viewMode === "grid"
                    ? "w-full h-48 object-cover"
                    : "w-full h-48 md:h-full object-cover"
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
              <h3 className="font-jetbrains-mono font-semibold text-2xl">
                {franchise.name}
              </h3>
              <p className="text-sm text-neutral-600">
                {franchise.legalEntity}
              </p>

              <div
                className="text-sm text-neutral-700 mt-2 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: franchise.description }}
                style={{ whiteSpace: "pre-line" }}
              />

              <div className="text-sm text-neutral-700 mt-3">
                <MapPin className="w-4 h-4 inline mr-1" />
                {franchise.locations.join(", ")}
              </div>
              <div className="text-sm text-neutral-700">
                <DollarSign className="w-4 h-4 inline mr-1" />$
                {franchise.startingPrice.toLocaleString()}
              </div>
              <div className="text-sm text-neutral-700">
                Founded: {new Date(franchise.foundedIn).getFullYear()} |
                Outlets: {franchise.totalOutlets}
              </div>

              <div className="mt-3 text-sm text-neutral-700">
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
