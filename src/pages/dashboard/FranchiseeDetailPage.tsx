import { useParams } from "react-router";
import { Principal } from "@dfinity/principal";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DollarSign,
  Briefcase,
  CalendarArrowDown,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Store,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useUser } from "@/context/AuthContext";
import { FranchiseHandler } from "@/handler/FranchiseHandler";

type FrontendFranchise = {
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
};

interface FrontendFranchiseResult {
  data?: FrontendFranchise;
  loading: boolean;
  error?: string;
}

export default function FranchiseDashboard() {
  const { id } = useParams<{ id: string }>();
  const { actor, principal } = useUser();
  const [franchise, setFranchise] = useState<FrontendFranchiseResult>({
    loading: false,
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingData, setEditingData] = useState<FrontendFranchise | null>(
    null
  );
  const [currentImage, setCurrentImage] = useState(0);

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
          data: franchise || undefined,
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

  const nextImage = () => {
    setCurrentImage(
      (prev) => (prev + 1) % (franchise.data?.productGallery.length || 1)
    );
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) =>
        (prev - 1 + (franchise.data?.productGallery.length || 1)) %
        (franchise.data?.productGallery.length || 1)
    );
  };

  const handleEditOpen = () => {
    setEditingData(franchise.data ? { ...franchise.data } : null);
    setIsEditOpen(true);
  };

  const handleEditChange = (field: keyof FrontendFranchise, value: any) => {
    if (editingData) {
      setEditingData({ ...editingData, [field]: value });
    }
  };

  const handleArrayChange = (
    field: "categoryIds" | "productGallery" | "locations",
    value: string
  ) => {
    if (editingData) {
      if (field === "categoryIds") {
        const array = value
          .split(",")
          .map((item) => Number(item.trim()))
          .filter((item) => !isNaN(item));
        setEditingData({ ...editingData, [field]: array });
      } else {
        const array = value.split(",").map((item) => item.trim());
        setEditingData({ ...editingData, [field]: array });
      }
    }
  };

  const handleLicenseDurationChange = (
    field: "OneTime" | "Years",
    value: any
  ) => {
    if (editingData) {
      setEditingData({
        ...editingData,
        licenseDuration: {
          ...editingData.licenseDuration,
          [field]: field === "OneTime" ? value === "true" : Number(value),
        },
      });
    }
  };

  const handleDateChange = (value: string) => {
    if (editingData) {
      setEditingData({
        ...editingData,
        foundedIn: new Date(value),
      });
    }
  };

  const handleSave = async () => {
    console.log("Saving franchise data:", editingData?.licenseDuration);
    if (editingData && actor) {
      try {
        const franchiseHandler = new FranchiseHandler(actor);
        const updatedId = await franchiseHandler.updateFranchise(
          editingData.id,
          editingData.name,
          editingData.categoryIds,
          editingData.description,
          editingData.startingPrice,
          editingData.foundedIn,
          editingData.totalOutlets,
          editingData.legalEntity,
          editingData.minGrossProfit,
          editingData.maxGrossProfit,
          editingData.minNetProfit,
          editingData.maxNetProfit,
          editingData.isDepositRequired,
          editingData.royaltyFee,
          editingData.licenseDuration,
          editingData.coverImageUrl,
          editingData.productGallery,
          editingData.contactNumber,
          editingData.contactEmail,
          editingData.locations,
          editingData.status,
          editingData.isVerified
        );
        setFranchise({ data: editingData, loading: false });
        setIsEditOpen(false);
        console.log(`Franchise ${updatedId} updated successfully`);
      } catch (error: any) {
        console.error("Failed to update franchise:", error.message);
      }
    }
  };

  if (!franchise.data) {
    return <div className="">Loading...</div>;
  } else {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Dashboard Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {franchise.data.name} Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your franchise details and operations
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Outlets
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                <Store className="w-8 h-8 text-green-600 mr-3" />
                <span className="text-2xl font-bold">
                  {franchise.data.totalOutlets}
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Net Profit Range
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                <DollarSign className="w-8 h-8 text-green-600 mr-3" />
                <span className="text-2xl font-bold">
                  ${franchise.data.minNetProfit?.toLocaleString()} - $
                  {franchise.data.maxNetProfit?.toLocaleString()}
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                <Briefcase className="w-8 h-8 text-green-600 mr-3" />
                <span className="text-2xl font-bold">
                  {franchise.data.status}
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Franchise Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-green-600" />
                Franchise Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 font-medium">Description</p>
                  <p className="text-gray-700">{franchise.data.description}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Legal Entity</p>
                  <p className="text-gray-700">{franchise.data.legalEntity}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Founded</p>
                  <p className="text-gray-700">
                    {franchise.data.foundedIn.getFullYear()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Locations</p>
                  <p className="text-gray-700">
                    {franchise.data.locations.join(", ")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Franchise Fee</span>
                    <span className="font-semibold">
                      {franchise.data.royaltyFee}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Starting Price</span>
                    <span className="font-semibold">
                      ${franchise.data.startingPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Gross Profit</span>
                    <span className="font-semibold">
                      ${franchise.data.minGrossProfit?.toLocaleString()} - $
                      {franchise.data.maxGrossProfit?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Net Profit</span>
                    <span className="font-semibold">
                      ${franchise.data.minNetProfit?.toLocaleString()} - $
                      {franchise.data.maxNetProfit?.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      Deposit Required
                    </span>
                    <span className="text-black">
                      {franchise.data.isDepositRequired ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      License Duration
                    </span>
                    <span className="text-black">
                      {franchise.data.licenseDuration.OneTime
                        ? "One Time"
                        : franchise.data.licenseDuration.Years
                          ? `${franchise.data.licenseDuration.Years} Years`
                          : "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gallery Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-green-600" />
                Gallery Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={
                      franchise.data.productGallery[currentImage] ||
                      "https://res.cloudinary.com/dqvlnzw9f/image/upload/v1755615357/no_pp_gjtf75.jpg"
                    }
                    alt={`Gallery image ${currentImage + 1}`}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-between p-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevImage}
                      className="bg-white/90 hover:bg-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextImage}
                      className="bg-white/90 hover:bg-white"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImage + 1} /{" "}
                      {franchise.data.productGallery.length}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {franchise.data.productGallery.map(
                    (image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`relative overflow-hidden rounded-md ${
                          currentImage === index ? "ring-2 ring-green-500" : ""
                        }`}
                      >
                        <img
                          src={
                            image ||
                            "https://res.cloudinary.com/dqvlnzw9f/image/upload/v1755615357/no_pp_gjtf75.jpg"
                          }
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-20 object-cover hover:scale-105 transition-transform"
                        />
                      </button>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}
