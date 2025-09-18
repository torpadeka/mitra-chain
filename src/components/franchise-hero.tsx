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
  Calendar,
  Store,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/AuthContext";
import { act, useState } from "react";
import { FranchiseHandler } from "@/handler/FranchiseHandler";
import { ApplicationHandler } from "@/handler/ApplicationHandler";
import { useNavigate } from "react-router";
import { principal } from "@ic-reactor/react/dist/utils";
import { ChatHandler } from "@/handler/ChatHandler";
import { Principal } from "@dfinity/principal";
import { stringToPrincipal } from "@/lib/utils";

interface FrontendFranchise {
  id: number;
  owner: string;
  name: string;
  categoryIds: number[];
  description: string;
  startingPrice: number;
  foundedIn: Date;
  totalOutlets: number;
  legalEntity: string;
  minGrossProfit?: number;
  maxGrossProfit?: number;
  minNetProfit?: number;
  maxNetProfit?: number;
  isDepositRequired: boolean;
  royaltyFee?: string;
  licenseDuration: { OneTime?: true; Years?: number };
  coverImageUrl: string;
  productGallery: string[];
  contactNumber?: string;
  contactEmail?: string;
  locations: string[];
  status: "Active" | "Inactive";
  isVerified: boolean;
  reviewsCount: number;
}

interface FranchiseHeroProps {
  franchise: FrontendFranchise;
}

export function FranchiseHero({ franchise }: FranchiseHeroProps) {
  const { user, actor, principal } = useUser();
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const chatHandler = new ChatHandler(actor!);
  const handleApply = async () => {
    if (!user || !actor) {
      setError("You must be logged in to apply.");
      console.error(error);
      return;
    }

    if (!("Franchisee" === user.role)) {
      setError("Only franchisees can apply for franchises.");
      console.error(error);
      return;
    }

    try {
      const applicationHandler = new ApplicationHandler(actor);
      await applicationHandler.applyForFranchise(franchise.id, coverLetter);
      setIsApplyOpen(false);
      setCoverLetter("");
      setError(null);
      alert("Application submitted successfully!");
    } catch (err: any) {
      const rejectMessage =
        err?.message?.match(/"Reject message": "([^"]+)"/)?.[1] || err.message;
      setError("Failed to submit application: " + rejectMessage);
      console.error(err);
    }
  };

  const handleContact = async () => {
    if (!actor || !principal) return;
    try {
      const conversations =
        await chatHandler.getAllConversationsByPrincipal(principal);

      let existingConversation = conversations.find((c: any) => {
        return c.participants.some((p: string) => p === franchise.owner);
      });

      let conversationId: number;

      if (existingConversation) {
        conversationId = Number(existingConversation.conversationId);
      } else {
        conversationId = Number(
          await chatHandler.createConversation(franchise.owner)
        );
      }

      console.log(conversationId);

      navigate(`/dashboard/franchisee/chat/${conversationId}`);
    } catch (err) {
      console.error("Error handling contact:", err);
    }
  };

  return (
    <section className="bg-background border-b border-brand-400 min-h-screen py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {/* Trending badge */}
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                <Store className="w-3 h-3 mr-1" />
                {franchise.totalOutlets}
              </Badge>

              {/* Verified badge */}
              {franchise.isVerified && (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}

              {/* Categories */}
              {franchise.categoryIds.length > 0 && (
                <Badge variant="secondary">
                  Category #{franchise.categoryIds[0]}
                </Badge>
              )}

              {franchise.status === "Active" ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  Active
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                  Inactive
                </Badge>
              )}
            </div>

            <h1 className="font-jetbrains-mono font-bold text-4xl md:text-5xl text-primary mb-4">
              {franchise.name}
            </h1>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center text-neutral-700">
                <MapPin className="w-4 h-4 mr-1" />
                {franchise.locations.join(", ")}
              </div>
              <div className="flex items-center text-neutral-700">
                <Calendar className="w-4 h-4 mr-1" />
                {franchise.foundedIn.getFullYear()}
              </div>
            </div>

            <p
              className="text-lg text-neutral-700 mb-8 leading-relaxed"
              style={{ whiteSpace: "pre-line" }}
              dangerouslySetInnerHTML={{ __html: franchise.description }}
            >
              {/* {franchise.description} */}
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center text-primary">
                <DollarSign className="w-5 h-5 mr-2 text-brand-600" />
                <span className="font-semibold text-xl">
                  From ${franchise.startingPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant={"primary"}
                    size={"lg"}
                    className="shadow-brand-400"
                    onClick={() => {
                      if (!user) {
                        setError("You must be logged in to apply.");
                        console.error(error);
                        return;
                      }
                      if (!("Franchisee" === user.role)) {
                        setError("Only franchisees can apply for franchises.");
                        console.error(error);
                        return;
                      }
                      setIsApplyOpen(true);
                    }}
                  >
                    Apply Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Apply for {franchise.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Write your application letter here..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="min-h-[150px]"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleApply}
                      disabled={!coverLetter.trim()}
                    >
                      Submit Application
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {user?.role && "Franchisee" === user?.role && (
                <Button
                  variant={"primary_outline"}
                  size={"lg"}
                  onClick={handleContact}
                >
                  Contact Franchisor
                </Button>
              )}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <img
              src={franchise.coverImageUrl}
              alt={franchise.name}
              className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg shadow-neutral-200"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
