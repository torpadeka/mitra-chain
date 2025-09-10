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

import { useState, useEffect } from "react";
import { useUser } from "@/context/AuthContext";
import {
  FranchiseHandler,
  FrontendFranchise,
} from "@/handler/FranchiseHandler";
import FloatingActionButton from "@/components/analyse-franchise";

export default function FranchiseDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { actor, principal } = useUser();
  const [franchise, setFranchise] = useState<FranchiseResult>({
    loading: false,
  });

  useEffect(() => {
    if (!actor || !principal) {
      setFranchise({
        error: "Authentication required",
        loading: false,
      });
      return;
    }

    const fetchFranchise = async () => {
      setFranchise((prev) => ({ ...prev, loading: true }));
      try {
        const franchiseHandler = new FranchiseHandler(actor);
        const franchise = await franchiseHandler.getFranchise(Number(id));
        setFranchise({
          data: franchise,
          loading: false,
        });
      } catch (error: any) {
        setFranchise({
          error: error.message,
          loading: false,
        });
      }
    };

    fetchFranchise();
  }, [id, actor, principal]);

  return (
    <div className="">
      {!franchise.data ? (
        <div className="">Loading</div>
      ) : (
        <div className="min-h-screen bg-secondary">
          {/* You may need to update FranchiseHero to accept new fields */}
          <FranchiseHero franchise={franchise.data} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <FranchiseDetails franchise={franchise.data} />
                <FranchiseGallery images={franchise.data.productGallery} />
                {/* <FranchiseReviews franchiseId={String(franchise.data.id)} /> */}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <FranchiseContact franchise={franchise.data} />
              </div>
            </div>

            {/* <RelatedFranchises currentFranchiseId={String(franchise.data.id)} /> */}
          </div>
          <FloatingActionButton />
          <Footer />
        </div>
      )}
    </div>
  );
}
