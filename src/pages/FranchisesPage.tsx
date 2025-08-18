import { FranchiseFilters } from "@/components/franchise-filters";
import { FranchiseGrid } from "@/components/franchise-grid";
import { FranchiseSearch } from "@/components/franchise-search";
import { Footer } from "@/components/footer";
import { useSearchParams } from "react-router";
import { FranchiseHandler } from "@/handler/FranchiseHandler";
import { useUser } from "@/context/AuthContext";

export default function FranchisesPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  console.log("Search query:", q);

  return (
    <div className="min-h-screen bg-gray-50">
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

        {/* Search Bar */}
        <FranchiseSearch />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <FranchiseFilters />
          </div>

          {/* Franchise Grid */}
          <div className="flex-1">
            <FranchiseGrid />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
