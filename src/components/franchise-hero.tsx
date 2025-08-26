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
  const handleApply = async () => {
    if (!user || !actor) {
      setError("You must be logged in to apply.");
      return;
    }

    if (!("Franchisee" in user.role)) {
      setError("Only franchisees can apply for franchises.");
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
    }
  };

  const handleContact = async () => {
    if (!actor || !principal) return;
    const chatHandler = new ChatHandler(actor);
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
          await actor.createConversation([
            principal,
            Principal.fromText(franchise.owner),
          ])
        );
      }

      navigate(`/dashboard/franchisee/chat/${conversationId}`);
    } catch (err) {
      console.error("Error handling contact:", err);
    }
  };

  return (
    <section className="bg-white border-b border-gray-200">
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

            <h1 className="font-serif font-bold text-4xl md:text-5xl text-gray-900 mb-4">
              {franchise.name}
            </h1>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold text-lg text-gray-900">4.8</span>
                <span className="text-gray-600">
                  ({franchise.reviewsCount} reviews)
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                {franchise.locations.join(", ")}
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                {franchise.foundedIn.getFullYear()}
              </div>
            </div>

            <p
              className="text-xl text-gray-700 mb-8 leading-relaxed"
              style={{ whiteSpace: "pre-line" }}
              dangerouslySetInnerHTML={{ __html: franchise.description }}
            >
              {/* {franchise.description} */}
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center text-gray-700">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                <span className="font-semibold">
                  From ${franchise.startingPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="btn-primary text-lg px-8 py-4"
                    onClick={() => {
                      if (!user) {
                        setError("You must be logged in to apply.");
                        return;
                      }
                      if (!("Franchisee" in user.role)) {
                        setError("Only franchisees can apply for franchises.");
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

              {user?.role && "Franchisee" in user?.role && (
                <Button
                  className="btn-secondary text-lg px-8 py-4"
                  onClick={handleContact}
                >
                  Contact Franchisor
                </Button>
              )}

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
              src={franchise.coverImageUrl}
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
