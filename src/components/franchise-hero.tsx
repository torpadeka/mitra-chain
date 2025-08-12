import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  DollarSign,
  TrendingUp,
  Shield,
  Heart,
  Share2,
} from "lucide-react";

interface FranchiseHeroProps {
  franchise: {
    name: string;
    industry: string;
    location: string;
    investment: { min: number; max: number };
    rating: number;
    reviews: number;
    verified: boolean;
    trending: boolean;
    description: string;
  };
}

export function FranchiseHero({ franchise }: FranchiseHeroProps) {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {franchise.trending && (
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              )}
              {franchise.verified && (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
              <Badge variant="secondary">{franchise.industry}</Badge>
            </div>

            <h1 className="font-bold text-4xl md:text-5xl text-gray-900 mb-4">
              {franchise.name}
            </h1>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold text-lg text-gray-900">
                  {franchise.rating}
                </span>
                <span className="text-gray-600">
                  ({franchise.reviews} reviews)
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                {franchise.location}
              </div>
            </div>

            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              {franchise.description}
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center text-gray-700">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                <span className="font-semibold">
                  ${franchise.investment.min.toLocaleString()} - $
                  {franchise.investment.max.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-primary text-lg px-8 py-4">
                Apply Now
              </Button>
              <Button className="btn-secondary text-lg px-8 py-4">
                Contact Franchisor
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-4 bg-transparent"
                >
                  <Heart className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-4 bg-transparent"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <img
              src="/cafe-hero-image.jpg"
              alt={franchise.name}
              className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
