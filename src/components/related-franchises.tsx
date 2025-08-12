import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, DollarSign } from "lucide-react";
import Link from "next/link";

const relatedFranchises = [
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
      "Modern fitness center franchise with state-of-the-art equipment.",
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
      "STEM education franchise teaching coding and robotics to children.",
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
    description: "Residential and commercial cleaning service franchise.",
  },
];

interface RelatedFranchisesProps {
  currentFranchiseId: string;
}

export function RelatedFranchises({
  currentFranchiseId,
}: RelatedFranchisesProps) {
  return (
    <section className="mt-16">
      <div className="mb-8">
        <h2 className="font-bold text-2xl md:text-3xl text-gray-900 mb-4">
          Similar Franchises You Might Like
        </h2>
        <p className="text-gray-600">
          Explore other verified franchise opportunities in related industries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedFranchises.map((franchise) => (
          <Card
            key={franchise.id}
            className="group hover:shadow-lg transition-shadow border-gray-200"
          >
            <div className="relative">
              <img
                src={franchise.image || "/placeholder.svg?height=200&width=400"}
                alt={franchise.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {franchise.name}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {franchise.industry}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900">
                    {franchise.rating}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {franchise.description}
              </p>

              <div className="space-y-2 mb-4">
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

              <Button asChild className="w-full btn-primary">
                <a href={`/franchise/${franchise.id}`}>View Details</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
