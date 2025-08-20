"use client";

import { useState, useEffect, useMemo } from "react";
import {
  FranchiseHandler,
  FrontendFranchise,
} from "@/handler/FranchiseHandler";
import { useUser } from "@/context/AuthContext";
import { FranchiseFilters } from "@/components/franchise-filters";
import { FranchiseSearch } from "@/components/franchise-search";
import { FranchiseGrid } from "@/components/franchise-grid";

export default function FranchisesPage() {
  // State from FranchiseSearch
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // State from FranchiseFilters
  const [investmentRange, setInvestmentRange] = useState([50000, 500000]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    investment: true,
    industry: true,
    location: true,
    features: false,
  });

  // State from FranchiseGrid
  const [favorites, setFavorites] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [franchises, setFranchises] = useState<FrontendFranchise[]>([]);

  const { actor, principal } = useUser();

  const franchiseHandler = useMemo(
    () => (actor ? new FranchiseHandler(actor) : null),
    [actor]
  );

  // Fetch franchises
  useEffect(() => {
    let isMounted = true;
    async function fetchFranchises() {
      if (!franchiseHandler) {
        setFranchises([]);
        return;
      }
      try {
        const result = await franchiseHandler.listFranchises();
        if (isMounted) setFranchises(result || []);
      } catch (err) {
        console.error("Failed to fetch franchises:", err);
      }
    }
    fetchFranchises();
    return () => {
      isMounted = false;
    };
  }, [franchiseHandler]);

  // Filter and sort franchises
  const filteredFranchises = useMemo(() => {
    let filtered = [...franchises];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (franchise) =>
          franchise.name.toLowerCase().includes(query) ||
          franchise.description.toLowerCase().includes(query) ||
          franchise.locations.some((location) =>
            location.toLowerCase().includes(query)
          )
      );
    }

    // Apply investment range filter
    filtered = filtered.filter(
      (franchise) =>
        franchise.startingPrice >= investmentRange[0] &&
        franchise.startingPrice <= investmentRange[1]
    );

    // Apply industry filter
    if (selectedIndustries.length > 0) {
      filtered = filtered.filter((franchise) =>
        franchise.categoryIds.some((id) =>
          selectedIndustries.includes(`category-${id}`)
        )
      );
    }

    // Apply location filter
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((franchise) =>
        franchise.locations.some((location) =>
          selectedLocations.some((selected) =>
            location.toLowerCase().includes(selected.toLowerCase())
          )
        )
      );
    }

    // Apply sort
    filtered.sort((a, b) => {
      if (sortBy === "price-low") {
        return a.startingPrice - b.startingPrice;
      } else if (sortBy === "price-high") {
        return b.startingPrice - a.startingPrice;
      } else if (sortBy === "reviews") {
        return b.reviewsCount - a.reviewsCount;
      } else {
        // Default: featured (e.g., sort by reviewsCount descending as a proxy)
        return b.reviewsCount - a.reviewsCount;
      }
    });

    return filtered;
  }, [
    franchises,
    searchQuery,
    investmentRange,
    selectedIndustries,
    selectedLocations,
    sortBy,
  ]);

  // Map categoryIds to industry IDs (assuming categoryIds correspond to industries)
  const industries = [
    { id: "category-1", label: "Food & Beverage", count: 45 },
    { id: "category-4", label: "Health & Fitness", count: 32 },
    { id: "category-3", label: "Education", count: 28 },
    { id: "category-5", label: "Automotive", count: 19 },
    { id: "category-6", label: "Home Services", count: 24 },
    { id: "category-7", label: "Retail", count: 18 },
  ];

  // Define locations (aligned with franchise locations)
  const locations = [
    { id: "north-america", label: "North America", count: 89 },
    { id: "europe", label: "Europe", count: 34 },
    { id: "asia-pacific", label: "Asia Pacific", count: 28 },
    { id: "latin-america", label: "Latin America", count: 15 },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-serif font-bold text-3xl md:text-4xl text-gray-900 mb-4">
            Browse Franchises
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Discover verified franchise opportunities across various industries.
            Filter by investment level, location, and more.
          </p>
        </div>
      </div>
      <div className="max-w-7xl grid grid-cols-1 lg:grid-cols-4 gap-6 mx-auto">
        {/* Filters */}
        <div className="lg:col-span-1">
          <FranchiseFilters
            investmentRange={investmentRange}
            setInvestmentRange={setInvestmentRange}
            selectedIndustries={selectedIndustries}
            setSelectedIndustries={setSelectedIndustries}
            selectedLocations={selectedLocations}
            setSelectedLocations={setSelectedLocations}
            expandedSections={expandedSections}
            setExpandedSections={setExpandedSections}
            industries={industries}
            locations={locations}
          />
        </div>

        {/* Search and Grid */}
        <div className="lg:col-span-3">
          <FranchiseSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            viewMode={viewMode}
            setViewMode={setViewMode}
            totalFranchises={filteredFranchises.length}
          />
          <FranchiseGrid
            franchises={filteredFranchises}
            favorites={favorites}
            setFavorites={setFavorites}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
          />
        </div>
      </div>
    </div>
  );
}
