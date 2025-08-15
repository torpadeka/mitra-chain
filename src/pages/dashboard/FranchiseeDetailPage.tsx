import { useParams } from "react-router";
import { Principal } from "@dfinity/principal";
import { useState } from "react";
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

// Types
export type LicenseDuration = {
  years: number;
  months?: number;
};

// Mock data for initial state
const getInitialFranchiseData = (id: string): Franchise => {
  return {
    id: Number(id) || 1,
    owner: "aaaaa-aa", // mock principal
    name: "Green Leaf Cafe",
    categoryIds: [1, 2],
    description:
      "Sustainable coffee shop franchise with organic, locally-sourced ingredients.",
    startingPrice: 150000,
    foundedIn: new Date("2015-06-15").getTime(),
    totalOutlets: 45,
    legalEntity: "Green Leaf Ltd.",
    minGrossProfit: 50000,
    maxGrossProfit: 120000,
    minNetProfit: 25000,
    maxNetProfit: 80000,
    isDepositRequired: true,
    royaltyFee: "5%",
    licenseDuration: { years: 5, months: 0 },
    coverImageUrl: "https://picsum.photos/200/400",
    productGallery: [
      "https://picsum.photos/400/300",
      "https://picsum.photos/401/300",
    ],
    contactNumber: "+1-555-1234",
    contactEmail: "info@greenleaf.com",
    locations: ["New York", "Los Angeles", "Chicago"],
    status: "Active",
    isVerified: true,
    reviewsCount: 124,
  };
};

export default function FranchiseDashboard() {
  const { id } = useParams<{ id: string }>();
  const [franchise, setFranchise] = useState<Franchise>(
    getInitialFranchiseData(id || "1")
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingData, setEditingData] = useState<Franchise | null>(null);
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % franchise.productGallery.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) =>
        (prev - 1 + franchise.productGallery.length) %
        franchise.productGallery.length
    );
  };

  const handleEditOpen = () => {
    setEditingData({ ...franchise });
    setIsEditOpen(true);
  };

  const handleEditChange = (field: keyof Franchise, value: any) => {
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
    subField: "years" | "months",
    value: string
  ) => {
    if (editingData) {
      const numValue = Number(value);
      setEditingData({
        ...editingData,
        licenseDuration: {
          ...editingData.licenseDuration,
          [subField]: isNaN(numValue) ? undefined : numValue,
        },
      });
    }
  };

  const handleDateChange = (value: string) => {
    if (editingData) {
      const timestamp = new Date(value).getTime();
      setEditingData({
        ...editingData,
        foundedIn: isNaN(timestamp) ? 0 : timestamp,
      });
    }
  };

  const handleSave = () => {
    if (editingData) {
      setFranchise(editingData);
      setIsEditOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Dashboard Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {franchise.name} Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your franchise details and operations
              </p>
            </div>
            {/* <div className="flex gap-4">
              <Button onClick={handleEditOpen} variant="default">
                Edit Details
              </Button>
            </div> */}
          </div>
        </div>
      </header>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Franchise Details</DialogTitle>
          </DialogHeader>
          {editingData && (
            <form className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <Input
                  value={editingData.name}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Description</label>
                <Textarea
                  value={editingData.description}
                  onChange={(e) =>
                    handleEditChange("description", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Starting Price</label>
                <Input
                  type="number"
                  value={editingData.startingPrice}
                  onChange={(e) =>
                    handleEditChange("startingPrice", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Founded In</label>
                <Input
                  type="date"
                  value={
                    new Date(editingData.foundedIn).toISOString().split("T")[0]
                  }
                  onChange={(e) => handleDateChange(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Total Outlets</label>
                <Input
                  type="number"
                  value={editingData.totalOutlets}
                  onChange={(e) =>
                    handleEditChange("totalOutlets", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Legal Entity</label>
                <Input
                  value={editingData.legalEntity}
                  onChange={(e) =>
                    handleEditChange("legalEntity", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Min Gross Profit
                </label>
                <Input
                  type="number"
                  value={editingData.minGrossProfit}
                  onChange={(e) =>
                    handleEditChange("minGrossProfit", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Max Gross Profit
                </label>
                <Input
                  type="number"
                  value={editingData.maxGrossProfit}
                  onChange={(e) =>
                    handleEditChange("maxGrossProfit", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Min Net Profit</label>
                <Input
                  type="number"
                  value={editingData.minNetProfit}
                  onChange={(e) =>
                    handleEditChange("minNetProfit", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Max Net Profit</label>
                <Input
                  type="number"
                  value={editingData.maxNetProfit}
                  onChange={(e) =>
                    handleEditChange("maxNetProfit", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Royalty Fee</label>
                <Input
                  value={editingData.royaltyFee}
                  onChange={(e) =>
                    handleEditChange("royaltyFee", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  License Duration (Years)
                </label>
                <Input
                  type="number"
                  value={editingData.licenseDuration.years}
                  onChange={(e) =>
                    handleLicenseDurationChange("years", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  License Duration (Months)
                </label>
                <Input
                  type="number"
                  value={editingData.licenseDuration.months || ""}
                  onChange={(e) =>
                    handleLicenseDurationChange("months", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Cover Image URL
                </label>
                <Input
                  value={editingData.coverImageUrl}
                  onChange={(e) =>
                    handleEditChange("coverImageUrl", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Product Gallery (comma separated)
                </label>
                <Input
                  value={editingData.productGallery.join(", ")}
                  onChange={(e) =>
                    handleArrayChange("productGallery", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Category IDs (comma separated)
                </label>
                <Input
                  value={editingData.categoryIds.join(", ")}
                  onChange={(e) =>
                    handleArrayChange("categoryIds", e.target.value)
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  checked={editingData.isDepositRequired}
                  onChange={(e) =>
                    handleEditChange("isDepositRequired", e.target.checked)
                  }
                  className="w-5 h-5"
                />
                <span>Deposit Required</span>
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  checked={editingData.isVerified}
                  onChange={(e) =>
                    handleEditChange("isVerified", e.target.checked)
                  }
                  className="w-5 h-5"
                />
                <span>Verified</span>
              </div>

              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={editingData.status}
                  onChange={(e) => handleEditChange("status", e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </form>
          )}
          <DialogFooter>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                {franchise.totalOutlets}
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
                ${franchise.minNetProfit?.toLocaleString()} - $
                {franchise.maxNetProfit?.toLocaleString()}
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
              <span className="text-2xl font-bold">{franchise.status}</span>
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
                <p className="text-gray-700">{franchise.description}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Legal Entity</p>
                <p className="text-gray-700">{franchise.legalEntity}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Founded</p>
                <p className="text-gray-700">
                  {new Date(franchise.foundedIn).getFullYear()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Locations</p>
                <p className="text-gray-700">
                  {franchise.locations.join(", ")}
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
                  <span className="font-semibold">{franchise.royaltyFee}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Starting Price</span>
                  <span className="font-semibold">
                    ${franchise.startingPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Gross Profit</span>
                  <span className="font-semibold">
                    ${franchise.minGrossProfit?.toLocaleString()} - $
                    {franchise.maxGrossProfit?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Net Profit</span>
                  <span className="font-semibold">
                    ${franchise.minNetProfit?.toLocaleString()} - $
                    {franchise.maxNetProfit?.toLocaleString()}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">
                    Deposit Required
                  </span>
                  <span className="text-black">
                    {franchise.isDepositRequired ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium mt-4">
                    License Duration
                  </span>
                  <span className="text-black">
                    {franchise.licenseDuration.years} years{" "}
                    {franchise.licenseDuration.months
                      ? `, ${franchise.licenseDuration.months} months`
                      : ""}
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
                    franchise.productGallery[currentImage] ||
                    "/placeholder.svg?height=400&width=600"
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
                    {currentImage + 1} / {franchise.productGallery.length}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {franchise.productGallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`relative overflow-hidden rounded-md ${
                      currentImage === index ? "ring-2 ring-green-500" : ""
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg?height=100&width=100"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-20 object-cover hover:scale-105 transition-transform"
                    />
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
