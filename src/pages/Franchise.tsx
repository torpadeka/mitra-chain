import { FranchiseHero } from "@/components/franchise-hero";
import { FranchiseDetails } from "@/components/franchise-details";
import { FranchiseGallery } from "@/components/franchise-gallery";
import { FranchiseReviews } from "@/components/franchise-reviews";
import { FranchiseContact } from "@/components/franchise-contact";
import { RelatedFranchises } from "@/components/related-franchises";
import { Footer } from "@/components/footer";
import { useParams } from "react-router";
import { Principal } from "@dfinity/principal";

// Types
export type LicenseDuration = {
  years: number;
  months?: number;
};

// Mock data
const getFranchiseData = (id: string): Franchise => {
  return {
    id: Number(id) || 1,
    owner: Principal.anonymous().toString(),
    name: "Green Leaf Cafe",
    categoryIds: [101, 205],
    description:
      "Green Leaf Cafe is a sustainable coffee shop franchise committed to serving organic, locally-sourced ingredients while creating a warm, community-focused environment.",
    startingPrice: 150000,
    foundedIn: new Date("2018-03-01").getTime(),
    totalOutlets: 52,
    legalEntity: "Green Leaf Cafe LLC",
    minGrossProfit: 50000,
    maxGrossProfit: 120000,
    minNetProfit: 30000,
    maxNetProfit: 80000,
    isDepositRequired: true,
    royaltyFee: "6%",
    licenseDuration: { years: 5, months: 0 },
    coverImageUrl: "/cafe-interior-1.jpg",
    productGallery: [
      "/cafe-interior-1.jpg",
      "/cafe-exterior.jpg",
      "/cafe-products.jpg",
      "/cafe-team.jpg",
    ],
    contactNumber: "+1 555-123-4567",
    contactEmail: "info@greenleafcafe.com",
    locations: ["North America", "Europe"],
    status: "Active",
    isVerified: true,
    reviewsCount: 124,
  };
};

export default function FranchiseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const franchise = getFranchiseData(id || "1");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* You may need to update FranchiseHero to accept new fields */}
      <FranchiseHero franchise={franchise} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <FranchiseDetails franchise={franchise} />
            <FranchiseGallery images={franchise.productGallery} />
            <FranchiseReviews franchiseId={String(franchise.id)} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FranchiseContact franchise={franchise} />
          </div>
        </div>

        <RelatedFranchises currentFranchiseId={String(franchise.id)} />
      </div>

      <Footer />
    </div>
  );
}
