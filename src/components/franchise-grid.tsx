"use client";

import { useEffect, useMemo, useState } from "react";
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
import { useUser } from "@/context/AuthContext";
import {
  FranchiseHandler,
  FrontendFranchise,
} from "@/handler/FranchiseHandler";

// const franchises: Franchise[] = [
//   {
//     id: 1,
//     owner: "aaaaa-aa", // mock principal
//     name: "Green Leaf Cafe",
//     categoryIds: [1, 2],
//     description:
//       "Sustainable coffee shop franchise with organic, locally-sourced ingredients.",
//     startingPrice: 150000,
//     foundedIn: new Date("2015-06-15").getTime(),
//     totalOutlets: 45,
//     legalEntity: "Green Leaf Ltd.",
//     minGrossProfit: 50000,
//     maxGrossProfit: 120000,
//     minNetProfit: 25000,
//     maxNetProfit: 80000,
//     isDepositRequired: true,
//     royaltyFee: "5%",
//     licenseDuration: { years: 5, months: 0 },
//     coverImageUrl: "https://picsum.photos/200/400",
//     productGallery: [
//       "https://picsum.photos/400/300",
//       "https://picsum.photos/401/300",
//     ],
//     contactNumber: "+1-555-1234",
//     contactEmail: "info@greenleaf.com",
//     locations: ["New York", "Los Angeles", "Chicago"],
//     status: "Active",
//     isVerified: true,
//     reviewsCount: 124,
//   },
//   {
//     id: 2,
//     owner: "bbbbb-aa",
//     name: "TechKids Academy",
//     categoryIds: [3],
//     description:
//       "STEM education franchise teaching coding and robotics to children aged 6-16.",
//     startingPrice: 75000,
//     foundedIn: new Date("2018-01-10").getTime(),
//     totalOutlets: 20,
//     legalEntity: "TechKids Inc.",
//     minGrossProfit: 30000,
//     maxGrossProfit: 90000,
//     minNetProfit: 15000,
//     maxNetProfit: 50000,
//     isDepositRequired: false,
//     royaltyFee: "3%",
//     licenseDuration: { years: 3, months: 6 },
//     coverImageUrl: "https://picsum.photos/200/401",
//     productGallery: [
//       "https://picsum.photos/402/300",
//       "https://picsum.photos/403/300",
//     ],
//     contactNumber: "+44-1234-5678",
//     contactEmail: "contact@techkids.com",
//     locations: ["Global"],
//     status: "Active",
//     isVerified: true,
//     reviewsCount: 156,
//   },
//   {
//     id: 3,
//     owner: "ccccc-aa",
//     name: "FitZone Gym",
//     categoryIds: [4],
//     description:
//       "Modern fitness center with state-of-the-art equipment and personal training.",
//     startingPrice: 250000,
//     foundedIn: new Date("2012-03-20").getTime(),
//     totalOutlets: 60,
//     legalEntity: "FitZone International",
//     minGrossProfit: 80000,
//     maxGrossProfit: 200000,
//     minNetProfit: 40000,
//     maxNetProfit: 120000,
//     isDepositRequired: true,
//     royaltyFee: "6%",
//     licenseDuration: { years: 10, months: 0 },
//     coverImageUrl: "https://picsum.photos/200/402",
//     productGallery: [
//       "https://picsum.photos/404/300",
//       "https://picsum.photos/405/300",
//     ],
//     contactNumber: "+1-222-555-7890",
//     contactEmail: "join@fitzone.com",
//     locations: ["Los Angeles", "San Diego"],
//     status: "Active",
//     isVerified: true,
//     reviewsCount: 89,
//   },
//   {
//     id: 4,
//     owner: "ddddd-aa",
//     name: "AutoCare Pro",
//     categoryIds: [5],
//     description:
//       "Full-service automotive repair and maintenance franchise with certified technicians.",
//     startingPrice: 200000,
//     foundedIn: new Date("2010-09-05").getTime(),
//     totalOutlets: 85,
//     legalEntity: "AutoCare Solutions LLC",
//     minGrossProfit: 70000,
//     maxGrossProfit: 180000,
//     minNetProfit: 35000,
//     maxNetProfit: 100000,
//     isDepositRequired: true,
//     royaltyFee: "4%",
//     licenseDuration: { years: 8, months: 0 },
//     coverImageUrl: "https://picsum.photos/200/403",
//     productGallery: [
//       "https://picsum.photos/406/300",
//       "https://picsum.photos/407/300",
//     ],
//     contactNumber: "+1-333-444-5555",
//     contactEmail: "info@autocarepro.com",
//     locations: ["Houston", "Dallas"],
//     status: "Active",
//     isVerified: true,
//     reviewsCount: 67,
//   },
//   {
//     id: 5,
//     owner: "eeeee-aa",
//     name: "CleanHome Services",
//     categoryIds: [6],
//     description:
//       "Residential and commercial cleaning service with eco-friendly products.",
//     startingPrice: 50000,
//     foundedIn: new Date("2016-05-22").getTime(),
//     totalOutlets: 100,
//     legalEntity: "CleanHome Co.",
//     minGrossProfit: 20000,
//     maxGrossProfit: 60000,
//     minNetProfit: 10000,
//     maxNetProfit: 40000,
//     isDepositRequired: false,
//     royaltyFee: "2%",
//     licenseDuration: { years: 2, months: 0 },
//     coverImageUrl: "https://picsum.photos/200/404",
//     productGallery: [
//       "https://picsum.photos/408/300",
//       "https://picsum.photos/409/300",
//     ],
//     contactNumber: "+1-777-888-9999",
//     contactEmail: "support@cleanhome.com",
//     locations: ["Miami", "Orlando", "Tampa"],
//     status: "Active",
//     isVerified: true,
//     reviewsCount: 203,
//   },
//   {
//     id: 6,
//     owner: "fffff-aa",
//     name: "Fashion Forward",
//     categoryIds: [7],
//     description:
//       "Contemporary fashion retail franchise targeting young professionals.",
//     startingPrice: 100000,
//     foundedIn: new Date("2019-02-14").getTime(),
//     totalOutlets: 25,
//     legalEntity: "Fashion Forward Ltd.",
//     minGrossProfit: 40000,
//     maxGrossProfit: 90000,
//     minNetProfit: 20000,
//     maxNetProfit: 50000,
//     isDepositRequired: true,
//     royaltyFee: "5%",
//     licenseDuration: { years: 4, months: 0 },
//     coverImageUrl: "https://picsum.photos/200/405",
//     productGallery: [
//       "https://picsum.photos/410/300",
//       "https://picsum.photos/411/300",
//     ],
//     contactNumber: "+44-555-666-7777",
//     contactEmail: "info@fashionforward.com",
//     locations: ["London", "Paris"],
//     status: "Active",
//     isVerified: true,
//     reviewsCount: 78,
//   },
//   {
//     id: 7,
//     owner: "ggggg-aa",
//     name: "Pet Paradise",
//     categoryIds: [8],
//     description: "Pet grooming and daycare services with luxury facilities.",
//     startingPrice: 80000,
//     foundedIn: new Date("2014-11-30").getTime(),
//     totalOutlets: 40,
//     legalEntity: "Pet Paradise Corp.",
//     minGrossProfit: 30000,
//     maxGrossProfit: 70000,
//     minNetProfit: 15000,
//     maxNetProfit: 40000,
//     isDepositRequired: false,
//     royaltyFee: "4%",
//     licenseDuration: { years: 3, months: 0 },
//     coverImageUrl: "https://picsum.photos/200/406",
//     productGallery: [
//       "https://picsum.photos/412/300",
//       "https://picsum.photos/413/300",
//     ],
//     contactNumber: "+1-888-777-6666",
//     contactEmail: "contact@petparadise.com",
//     locations: ["Seattle", "Portland"],
//     status: "Active",
//     isVerified: true,
//     reviewsCount: 54,
//   },
//   {
//     id: 8,
//     owner: "hhhhh-aa",
//     name: "Book Haven",
//     categoryIds: [9],
//     description:
//       "Independent bookstore franchise with community events and cafe.",
//     startingPrice: 60000,
//     foundedIn: new Date("2011-07-18").getTime(),
//     totalOutlets: 30,
//     legalEntity: "Book Haven Ltd.",
//     minGrossProfit: 25000,
//     maxGrossProfit: 55000,
//     minNetProfit: 12000,
//     maxNetProfit: 30000,
//     isDepositRequired: false,
//     royaltyFee: "3%",
//     licenseDuration: { years: 2, months: 6 },
//     coverImageUrl: "https://picsum.photos/200/407",
//     productGallery: [
//       "https://picsum.photos/414/300",
//       "https://picsum.photos/415/300",
//     ],
//     contactNumber: "+61-1234-5678",
//     contactEmail: "hello@bookhaven.com",
//     locations: ["Sydney", "Melbourne"],
//     status: "Active",
//     isVerified: false,
//     reviewsCount: 33,
//   },
//   {
//     id: 9,
//     owner: "iiiii-aa",
//     name: "Urban Eats",
//     categoryIds: [1, 10],
//     description:
//       "Fast-casual dining with locally sourced, organic ingredients.",
//     startingPrice: 120000,
//     foundedIn: new Date("2017-04-08").getTime(),
//     totalOutlets: 55,
//     legalEntity: "Urban Eats Inc.",
//     minGrossProfit: 50000,
//     maxGrossProfit: 110000,
//     minNetProfit: 25000,
//     maxNetProfit: 60000,
//     isDepositRequired: true,
//     royaltyFee: "5%",
//     licenseDuration: { years: 5, months: 0 },
//     coverImageUrl: "https://picsum.photos/200/408",
//     productGallery: [
//       "https://picsum.photos/416/300",
//       "https://picsum.photos/417/300",
//     ],
//     contactNumber: "+1-444-333-2222",
//     contactEmail: "info@urbaneats.com",
//     locations: ["Boston", "Philadelphia"],
//     status: "Active",
//     isVerified: true,
//     reviewsCount: 102,
//   },
//   {
//     id: 10,
//     owner: "jjjjj-aa",
//     name: "Mindful Yoga",
//     categoryIds: [4, 11],
//     description: "Yoga studio franchise promoting wellness and mindfulness.",
//     startingPrice: 70000,
//     foundedIn: new Date("2013-10-25").getTime(),
//     totalOutlets: 18,
//     legalEntity: "Mindful Yoga Ltd.",
//     minGrossProfit: 20000,
//     maxGrossProfit: 50000,
//     minNetProfit: 10000,
//     maxNetProfit: 25000,
//     isDepositRequired: false,
//     royaltyFee: "3%",
//     licenseDuration: { years: 3, months: 0 },
//     coverImageUrl: "https://picsum.photos/200/409",
//     productGallery: [
//       "https://picsum.photos/418/300",
//       "https://picsum.photos/419/300",
//     ],
//     contactNumber: "+1-222-111-0000",
//     contactEmail: "contact@mindfulyoga.com",
//     locations: ["Austin", "Denver"],
//     status: "Active",
//     isVerified: true,
//     reviewsCount: 45,
//   },
//   {
//     id: 11,
//     owner: "kkkkk-aa",
//     name: "EcoBuild Homes",
//     categoryIds: [12],
//     description: "Sustainable home construction using eco-friendly materials.",
//     startingPrice: 300000,
//     foundedIn: new Date("2009-08-12").getTime(),
//     totalOutlets: 12,
//     legalEntity: "EcoBuild Ltd.",
//     minGrossProfit: 100000,
//     maxGrossProfit: 250000,
//     minNetProfit: 50000,
//     maxNetProfit: 150000,
//     isDepositRequired: true,
//     royaltyFee: "7%",
//     licenseDuration: { years: 15, months: 0 },
//     coverImageUrl: "https://picsum.photos/200/410",
//     productGallery: [
//       "https://picsum.photos/420/300",
//       "https://picsum.photos/421/300",
//     ],
//     contactNumber: "+1-999-888-7777",
//     contactEmail: "build@ecobuild.com",
//     locations: ["San Francisco", "San Jose"],
//     status: "Active",
//     isVerified: true,
//     reviewsCount: 26,
//   },
// ];

export function FranchiseGrid() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [franchises, setFranchises] = useState<FrontendFranchise[]>([]);

  const { actor, principal } = useUser();

  const franchiseHandler = useMemo(
    () => (actor ? new FranchiseHandler(actor) : null),
    [actor]
  );

  useEffect(() => {
    let isMounted = true;
    async function fetchFranchises() {
      if (!franchiseHandler) {
        setFranchises([]);
        return;
      }
      try {
        const result = await franchiseHandler.listFranchises();
        console.log("Fetched franchises:", result);
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

  const toggleFavorite = (franchiseId: number) => {
    setFavorites((prev) =>
      prev.includes(franchiseId)
        ? prev.filter((id) => id !== franchiseId)
        : [...prev, franchiseId]
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

      {/* Franchise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {franchises.map((franchise) => (
          <Card
            key={franchise.id}
            className="group hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img
                src={franchise.coverImageUrl}
                alt={franchise.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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

            <CardContent className="p-6">
              <h3 className="font-semibold text-lg">{franchise.name}</h3>
              <p className="text-sm text-gray-500">{franchise.legalEntity}</p>

              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
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
