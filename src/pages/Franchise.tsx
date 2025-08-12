import { FranchiseHero } from "@/components/franchise-hero";
import { FranchiseDetails } from "@/components/franchise-details";
import { FranchiseGallery } from "@/components/franchise-gallery";
import { FranchiseReviews } from "@/components/franchise-reviews";
import { FranchiseContact } from "@/components/franchise-contact";
import { RelatedFranchises } from "@/components/related-franchises";
import { Footer } from "@/components/footer";
import { useParams } from "react-router";

// Mock data - in real app this would come from API/database
const getFranchiseData = (id: string) => {
  return {
    id,
    name: "Green Leaf Cafe",
    industry: "Food & Beverage",
    location: "North America",
    investment: { min: 150000, max: 300000 },
    rating: 4.8,
    reviews: 124,
    verified: true,
    trending: true,
    description:
      "Green Leaf Cafe is a sustainable coffee shop franchise committed to serving organic, locally-sourced ingredients while creating a warm, community-focused environment. Our franchise model combines environmental responsibility with profitable business practices.",
    longDescription:
      "Founded in 2018, Green Leaf Cafe has grown from a single location to over 50 franchises across North America. We specialize in premium coffee, fresh pastries, and healthy meal options, all sourced from local suppliers whenever possible. Our unique approach to sustainability and community engagement has made us a favorite among environmentally conscious consumers.",
    features: [
      "Training Provided",
      "Financing Available",
      "Ongoing Support",
      "Marketing Support",
      "Site Selection Help",
    ],
    images: [
      "/cafe-interior-1.jpg",
      "/cafe-exterior.jpg",
      "/cafe-products.jpg",
      "/cafe-team.jpg",
    ],
    financials: {
      franchiseFee: 45000,
      totalInvestment: { min: 150000, max: 300000 },
      liquidCapital: 100000,
      netWorth: 250000,
      royaltyFee: "6%",
      marketingFee: "2%",
    },
    support: {
      training: "3 weeks initial training + ongoing support",
      marketing: "National advertising campaigns + local marketing support",
      operations: "Operations manual + regular consultations",
      technology: "POS system + mobile app integration",
    },
    requirements: {
      experience: "No prior experience required",
      space: "1,200 - 2,500 sq ft",
      employees: "8-15 employees",
      territory: "Protected territory radius",
    },
  };
};

export default function FranchiseDetailsPage() {
  const { id } = useParams<{ id: string }>(); // same as params.id in Next.js

  const franchise = getFranchiseData(id || "");

  return (
    <div className="min-h-screen bg-gray-50">
      <FranchiseHero franchise={franchise} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <FranchiseDetails franchise={franchise} />
            <FranchiseGallery images={franchise.images} />
            <FranchiseReviews franchiseId={franchise.id} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FranchiseContact franchise={franchise} />
          </div>
        </div>

        <RelatedFranchises currentFranchiseId={franchise.id} />
      </div>

      <Footer />
    </div>
  );
}
