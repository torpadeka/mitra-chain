"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Plus,
  X,
  Building2,
  DollarSign,
  Star,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import type { ActorSubclass } from "@dfinity/agent";
import type { _SERVICE } from "@/declarations/backend/backend.did";
import {
  FranchiseHandler,
  type FrontendFranchise,
} from "@/handler/FranchiseHandler";
import {
  CategoryHandler,
  type FrontendCategory,
} from "@/handler/CategoryHandler";
import { toast } from "sonner";
import { useUser } from "@/context/AuthContext";

interface AddFranchiseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddFranchiseModal({ isOpen, onClose }: AddFranchiseModalProps) {
  const { actor } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedSupport, setSelectedSupport] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<FrontendCategory[]>([]);

  const [formData, setFormData] = useState<Partial<FrontendFranchise>>({
    name: "",
    categoryIds: [],
    description: "",
    startingPrice: 0,
    foundedIn: new Date(),
    totalOutlets: 0,
    legalEntity: "",
    minGrossProfit: 0,
    maxGrossProfit: 0,
    minNetProfit: 0,
    maxNetProfit: 0,
    isDepositRequired: false,
    royaltyFee: undefined,
    licenseDuration: { OneTime: true },
    coverImageUrl: "",
    productGallery: [],
    contactNumber: undefined,
    contactEmail: undefined,
    locations: [],
    status: "Active",
    isVerified: false,
    reviewsCount: 0,
  });

  const features = [
    "Proven Business Model",
    "Comprehensive Training",
    "Marketing Support",
    "Territory Protection",
    "Ongoing Support",
    "Brand Recognition",
    "Bulk Purchasing Power",
    "Technology Platform",
  ];

  const supportTypes = [
    "Initial Training",
    "Ongoing Training",
    "Marketing Materials",
    "Operations Manual",
    "Site Selection",
    "Grand Opening Support",
    "Quality Assurance",
    "Financial Guidance",
  ];

  const steps = [
    {
      number: 1,
      title: "Basic Information",
      description: "Tell us about your franchise",
      icon: Building2,
    },
    {
      number: 2,
      title: "Investment Details",
      description: "Financial requirements and fees",
      icon: DollarSign,
    },
    {
      number: 3,
      title: "Features & Support",
      description: "What you offer franchisees",
      icon: Star,
    },
    {
      number: 4,
      title: "Media & Requirements",
      description: "Images and franchisee criteria",
      icon: ImageIcon,
    },
  ];

  useEffect(() => {
    if (!actor) return;
    const fetchCategories = async () => {
      const categoryHandler = new CategoryHandler(actor);
      const fetchedCategories = await categoryHandler.listCategories();
      setCategories(fetchedCategories);
    };
    if (isOpen) {
      fetchCategories();
    }
  }, [actor, isOpen]);

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name?.trim()) errors.name = "Franchise name is required";
        if (!formData.categoryIds?.length)
          errors.categoryIds = "Please select a category";
        if (!formData.description?.trim())
          errors.description = "Description is required";
        if (!formData.contactNumber?.trim())
          errors.contactNumber = "Contact phone is required";
        if (
          formData.contactEmail &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)
        )
          errors.contactEmail = "Invalid email format";
        if (
          formData.coverImageUrl &&
          !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.coverImageUrl)
        )
          errors.coverImageUrl = "Invalid URL format";
        break;
      case 2:
        if (!formData.startingPrice || formData.startingPrice <= 0)
          errors.startingPrice = "Franchise fee must be greater than 0";
        if (!formData.royaltyFee || Number(formData.royaltyFee) <= 0)
          errors.royaltyFee = "Royalty fee must be greater than 0";
        if (!formData.minGrossProfit || formData.minGrossProfit <= 0)
          errors.minGrossProfit = "Minimum investment must be greater than 0";
        if (!formData.maxGrossProfit || formData.maxGrossProfit <= 0)
          errors.maxGrossProfit = "Maximum investment must be greater than 0";
        if (!formData.legalEntity?.trim())
          errors.legalEntity = "Financing options are required";
        if (!formData.totalOutlets || formData.totalOutlets <= 0)
          errors.totalOutlets = "Total outlets must be greater than 0";
        if (!formData.licenseDuration)
          errors.licenseDuration = "License duration is required";
        if (
          formData.minGrossProfit &&
          formData.maxGrossProfit &&
          formData.minGrossProfit >= formData.maxGrossProfit
        ) {
          errors.maxGrossProfit =
            "Maximum investment must be greater than minimum";
        }
        if (formData.minNetProfit && formData.minNetProfit < 0)
          errors.minNetProfit = "Marketing fee cannot be negative";
        if (formData.maxNetProfit && formData.maxNetProfit < 0)
          errors.maxNetProfit = "Liquid capital cannot be negative";
        break;
      case 3:
        if (selectedFeatures.length === 0)
          errors.features = "At least one feature must be selected";
        if (selectedSupport.length === 0)
          errors.support = "At least one support type must be selected";
        break;
      case 4:
        if (!formData.description?.trim())
          errors.description = "Franchisee requirements are required";
        if (!formData.productGallery?.length)
          errors.productGallery = "At least one image is required";
        if (!formData.locations?.length)
          errors.locations = "At least one territory is required";
        if (!formData.totalOutlets || formData.totalOutlets <= 0)
          errors.totalOutlets = "Target units must be greater than 0";
        break;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) => {
      const newFeatures = prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature];
      console.log("Updated selectedFeatures:", newFeatures);
      return newFeatures;
    });
    if (fieldErrors.features) {
      setFieldErrors((prev) => ({ ...prev, features: "" }));
    }
  };

  const handleSupportToggle = (support: string) => {
    setSelectedSupport((prev) =>
      prev.includes(support)
        ? prev.filter((s) => s !== support)
        : [...prev, support]
    );
    if (fieldErrors.support) {
      setFieldErrors((prev) => ({ ...prev, support: "" }));
    }
  };

  const handleInputChange = (field: keyof FrontendFranchise, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "mitra-chain");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dsl9fmscw/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
    return "";
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const uploadedUrls = await Promise.all(
        Array.from(files).map(async (file) => await uploadFile(file))
      );
      setFormData((prev) => ({
        ...prev,
        productGallery: [...(prev.productGallery || []), ...uploadedUrls],
        coverImageUrl: uploadedUrls[0] || prev.coverImageUrl,
      }));
      if (fieldErrors.productGallery) {
        setFieldErrors((prev) => ({ ...prev, productGallery: "" }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
    setLoading(true);
    setError(null);
    if (!actor) return;

    try {
      const franchiseHandler = new FranchiseHandler(actor);

      let description = formData.description || "";
      if (selectedFeatures.length > 0) {
        description += `<br><br>Key Features: ${selectedFeatures.join(", ")}`;
      }
      if (selectedSupport.length > 0) {
        description += `<br><br>Support Provided: ${selectedSupport.join(", ")}`;
      }

      console.log("Final description:", description);

      console.log(
        "Franchise created with ID:",
        formData.name || "",
        formData.categoryIds || [],
        description,
        formData.startingPrice || 0,
        formData.foundedIn || new Date(),
        formData.totalOutlets || 0,
        formData.legalEntity || "",
        formData.minGrossProfit,
        formData.maxGrossProfit,
        formData.minNetProfit,
        formData.maxNetProfit,
        formData.isDepositRequired || false,
        formData.royaltyFee,
        formData.licenseDuration || { OneTime: true },
        formData.coverImageUrl || "",
        formData.productGallery || [],
        formData.contactNumber,
        formData.contactEmail,
        formData.locations || []
      );

      const franchiseId = await franchiseHandler.createFranchise(
        formData.name || "",
        formData.categoryIds || [],
        description,
        formData.startingPrice || 0,
        formData.foundedIn || new Date(),
        formData.totalOutlets || 0,
        formData.legalEntity || "",
        formData.minGrossProfit,
        formData.maxGrossProfit,
        formData.minNetProfit,
        formData.maxNetProfit,
        formData.isDepositRequired || false,
        String(formData.royaltyFee),
        formData.licenseDuration || { OneTime: true },
        formData.coverImageUrl || "",
        formData.productGallery || [],
        formData.contactNumber,
        formData.contactEmail,
        formData.locations || []
      );

      toast("Success", {
        description: `Franchise created with ID: ${franchiseId}`,
      });
      onClose();
      setCurrentStep(1);
      setFormData({});
      setSelectedFeatures([]);
      setSelectedSupport([]);
    } catch (err) {
      setError("Failed to create franchise. Please try again.");
      console.log(err);
      toast("Error", {
        description: "Failed to create franchise. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (!actor) return;
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const progress = (currentStep / 4) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-2 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                Add New Franchise
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                Create your franchise listing in just a few steps
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                return (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                          isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : isActive
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-muted-foreground/30 text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </div>
                      <div className="text-center mt-2">
                        <div
                          className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {step.title}
                        </div>
                        <div className="text-xs text-muted-foreground hidden sm:block">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-px mx-4 ${isCompleted ? "bg-green-500" : "bg-muted-foreground/30"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Basic Information
                    </CardTitle>
                    <CardDescription>
                      Tell us about your franchise opportunity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="franchiseName">
                          Franchise Name{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="franchiseName"
                          placeholder="Enter franchise name"
                          value={formData.name || ""}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className={
                            fieldErrors.name ? "border-destructive" : ""
                          }
                        />
                        {fieldErrors.name && (
                          <p className="text-sm text-destructive">
                            {fieldErrors.name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">
                          Category <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) => {
                            handleInputChange("categoryIds", [Number(value)]);
                          }}
                        >
                          <SelectTrigger
                            className={
                              fieldErrors.categoryIds
                                ? "border-destructive"
                                : ""
                            }
                          >
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldErrors.categoryIds && (
                          <p className="text-sm text-destructive">
                            {fieldErrors.categoryIds}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Franchise Description{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your franchise opportunity, what makes it unique, and why someone should invest..."
                        className={`min-h-[120px] ${fieldErrors.description ? "border-destructive" : ""}`}
                        value={formData.description || ""}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                      />
                      {fieldErrors.description && (
                        <p className="text-sm text-destructive">
                          {fieldErrors.description}
                        </p>
                      )}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website URL</Label>
                        <Input
                          id="website"
                          type="url"
                          placeholder="https://yourfranchise.com"
                          value={formData.coverImageUrl || ""}
                          onChange={(e) =>
                            handleInputChange("coverImageUrl", e.target.value)
                          }
                          className={
                            fieldErrors.coverImageUrl
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {fieldErrors.coverImageUrl && (
                          <p className="text-sm text-destructive">
                            {fieldErrors.coverImageUrl}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          Contact Phone{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={formData.contactNumber || ""}
                          onChange={(e) =>
                            handleInputChange("contactNumber", e.target.value)
                          }
                          className={
                            fieldErrors.contactNumber
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {fieldErrors.contactNumber && (
                          <p className="text-sm text-destructive">
                            {fieldErrors.contactNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="contact@yourfranchise.com"
                        value={formData.contactEmail || ""}
                        onChange={(e) =>
                          handleInputChange("contactEmail", e.target.value)
                        }
                        className={
                          fieldErrors.contactEmail ? "border-destructive" : ""
                        }
                      />
                      {fieldErrors.contactEmail && (
                        <p className="text-sm text-destructive">
                          {fieldErrors.contactEmail}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Investment & Financial */}
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Investment & Financial Details
                    </CardTitle>
                    <CardDescription>
                      Specify the financial requirements and fees
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="franchiseFee">
                          Franchise Fee{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="franchiseFee"
                            type="number"
                            placeholder="45000"
                            className={`pl-10 ${fieldErrors.startingPrice ? "border-destructive" : ""}`}
                            value={formData.startingPrice || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "startingPrice",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                        {fieldErrors.startingPrice && (
                          <p className="text-sm text-destructive">
                            {fieldErrors.startingPrice}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="royaltyFee">
                          Royalty Fee (%){" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="royaltyFee"
                          type="number"
                          placeholder="6"
                          min="0"
                          max="100"
                          step="0.1"
                          className={
                            fieldErrors.royaltyFee ? "border-destructive" : ""
                          }
                          value={formData.royaltyFee || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "royaltyFee",
                              Number(e.target.value)
                            )
                          }
                        />
                        {fieldErrors.royaltyFee && (
                          <p className="text-sm text-destructive">
                            {fieldErrors.royaltyFee}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="minInvestment">
                          Minimum Investment{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="minInvestment"
                            type="number"
                            placeholder="50000"
                            className={`pl-10 ${fieldErrors.minGrossProfit ? "border-destructive" : ""}`}
                            value={formData.minGrossProfit || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "minGrossProfit",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                        {fieldErrors.minGrossProfit && (
                          <p className="text-sm text-destructive">
                            {fieldErrors.minGrossProfit}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxInvestment">
                          Maximum Investment{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="maxInvestment"
                            type="number"
                            placeholder="100000"
                            className={`pl-10 ${fieldErrors.maxGrossProfit ? "border-destructive" : ""}`}
                            value={formData.maxGrossProfit || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "maxGrossProfit",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                        {fieldErrors.maxGrossProfit && (
                          <p className="text-sm text-destructive">
                            {fieldErrors.maxGrossProfit}
                          </p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="marketingFee">Marketing Fee (%)</Label>
                        <Input
                          id="marketingFee"
                          type="number"
                          placeholder="2"
                          min="0"
                          max="100"
                          step="0.1"
                          className={
                            fieldErrors.minNetProfit ? "border-destructive" : ""
                          }
                          value={formData.minNetProfit || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "minNetProfit",
                              Number(e.target.value)
                            )
                          }
                        />
                        {fieldErrors.minNetProfit && (
                          <p className="text-sm text-destructive">
                            {fieldErrors.minNetProfit}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="liquidCapital">
                          Required Liquid Capital
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="liquidCapital"
                            type="number"
                            placeholder="75000"
                            className={`pl-10 ${fieldErrors.maxNetProfit ? "border-destructive" : ""}`}
                            value={formData.maxNetProfit || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "maxNetProfit",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                        {fieldErrors.maxNetProfit && (
                          <p className="text-sm text-destructive">
                            {fieldErrors.maxNetProfit}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="financingOptions">
                        Financing Options{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="financingOptions"
                        placeholder="Describe available financing options, partnerships with lenders, or in-house financing..."
                        className={`min-h-[100px] ${fieldErrors.legalEntity ? "border-destructive" : ""}`}
                        value={formData.legalEntity || ""}
                        onChange={(e) =>
                          handleInputChange("legalEntity", e.target.value)
                        }
                      />
                      {fieldErrors.legalEntity && (
                        <p className="text-sm text-destructive">
                          {fieldErrors.legalEntity}
                        </p>
                      )}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="foundedIn">Founded In</Label>
                        <Input
                          id="foundedIn"
                          type="date"
                          value={
                            formData.foundedIn
                              ? formData.foundedIn.toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "foundedIn",
                              new Date(e.target.value)
                            )
                          }
                          className={
                            fieldErrors.foundedIn ? "border-destructive" : ""
                          }
                        />
                        {fieldErrors.foundedIn && (
                          <p className="text-sm text-destructive">
                            {fieldErrors.foundedIn}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="totalOutlets">
                          Total Outlets{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="totalOutlets"
                          type="number"
                          placeholder="50"
                          value={formData.totalOutlets || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "totalOutlets",
                              Number(e.target.value)
                            )
                          }
                          className={
                            fieldErrors.totalOutlets ? "border-destructive" : ""
                          }
                        />
                        {fieldErrors.totalOutlets && (
                          <p className="text-sm text-destructive">
                            {fieldErrors.totalOutlets}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="licenseDuration">
                          License Duration{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleInputChange(
                              "licenseDuration",
                              value === "OneTime"
                                ? { OneTime: true }
                                : { Years: Number(value) }
                            )
                          }
                        >
                          <SelectTrigger
                            className={
                              fieldErrors.licenseDuration
                                ? "border-destructive"
                                : ""
                            }
                          >
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OneTime">One-Time</SelectItem>
                            <SelectItem value="1">1 Year</SelectItem>
                            <SelectItem value="2">2 Years</SelectItem>
                            <SelectItem value="5">5 Years</SelectItem>
                            <SelectItem value="10">10 Years</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldErrors.licenseDuration && (
                          <p className="text-sm text-destructive">
                            {fieldErrors.licenseDuration}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isDepositRequired"
                        checked={formData.isDepositRequired || false}
                        onCheckedChange={(checked) =>
                          handleInputChange("isDepositRequired", checked)
                        }
                      />
                      <Label
                        htmlFor="isDepositRequired"
                        className="text-sm font-medium"
                      >
                        Deposit Required
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Features & Support */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Features & Support
                    </CardTitle>
                    <CardDescription>
                      Highlight what makes your franchise attractive to
                      potential investors
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-base font-semibold">
                          Key Features{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1 mb-4">
                          Select the key features that make your franchise
                          opportunity attractive
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {features.map((feature) => (
                            <div
                              key={feature}
                              className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                                selectedFeatures.includes(feature)
                                  ? "bg-primary/5 border-primary"
                                  : "border-border"
                              }`}
                              // onClick={() => handleFeatureToggle(feature)}
                            >
                              <Checkbox
                                id={feature}
                                checked={selectedFeatures.includes(feature)}
                                onCheckedChange={() =>
                                  handleFeatureToggle(feature)
                                }
                              />
                              <Label
                                htmlFor={feature}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {feature}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {fieldErrors.features && (
                          <p className="text-sm text-destructive mt-2">
                            {fieldErrors.features}
                          </p>
                        )}
                      </div>

                      <Separator />

                      <div>
                        <Label className="text-base font-semibold">
                          Support Provided{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1 mb-4">
                          Select the types of support you provide to franchisees
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {supportTypes.map((support) => (
                            <div
                              key={support}
                              className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                                selectedSupport.includes(support)
                                  ? "bg-primary/5 border-primary"
                                  : "border-border"
                              }`}
                              // onClick={() => handleSupportToggle(support)}
                            >
                              <Checkbox
                                id={support}
                                checked={selectedSupport.includes(support)}
                                onCheckedChange={() =>
                                  handleSupportToggle(support)
                                }
                              />
                              <Label
                                htmlFor={support}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {support}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {fieldErrors.support && (
                          <p className="text-sm text-destructive mt-2">
                            {fieldErrors.support}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Media & Requirements */}
              {currentStep === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Media & Requirements
                    </CardTitle>
                    <CardDescription>
                      Add images and specify franchisee requirements
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">
                        Franchise Images{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            Upload franchise images
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Drag and drop images here, or click to browse
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Supports: JPG, PNG, WebP (Max 5MB each)
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload">
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4 bg-transparent"
                            asChild
                          >
                            <span>Choose Files</span>
                          </Button>
                        </label>
                      </div>
                      {fieldErrors.productGallery && (
                        <p className="text-sm text-destructive">
                          {fieldErrors.productGallery}
                        </p>
                      )}

                      {formData.productGallery &&
                        formData.productGallery.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">
                              Uploaded Images:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {formData.productGallery.map((url, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs px-3 py-2"
                                >
                                  <ImageIcon className="w-3 h-3 mr-1" />
                                  {url.split("/").pop()}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0 ml-2 hover:bg-transparent"
                                    onClick={() =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        productGallery:
                                          prev.productGallery?.filter(
                                            (_, i) => i !== index
                                          ),
                                      }))
                                    }
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="requirements"
                          className="text-base font-semibold"
                        >
                          Franchisee Requirements{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="requirements"
                          placeholder="Describe the ideal franchisee profile, experience requirements, financial qualifications, and any other criteria..."
                          className={`min-h-[120px] ${fieldErrors.description ? "border-destructive" : ""}`}
                          value={formData.description || ""}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                        />
                        {fieldErrors.description && (
                          <p className="text-sm text-destructive">
                            {fieldErrors.description}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="territories">
                            Available Territories{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="territories"
                            placeholder="e.g., California, Texas, Florida"
                            value={formData.locations?.join(", ") || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "locations",
                                e.target.value.split(", ").filter(Boolean)
                              )
                            }
                            className={
                              fieldErrors.locations ? "border-destructive" : ""
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            Separate multiple territories with commas
                          </p>
                          {fieldErrors.locations && (
                            <p className="text-sm text-destructive">
                              {fieldErrors.locations}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="units">
                            Target Units{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="units"
                            type="number"
                            placeholder="50"
                            value={formData.totalOutlets || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "totalOutlets",
                                Number(e.target.value)
                              )
                            }
                            className={
                              fieldErrors.totalOutlets
                                ? "border-destructive"
                                : ""
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            How many units do you plan to franchise?
                          </p>
                          {fieldErrors.totalOutlets && (
                            <p className="text-sm text-destructive">
                              {fieldErrors.totalOutlets}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t bg-background">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || loading}
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {currentStep} of {steps.length} steps
            </div>

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={loading}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {loading ? "Creating Franchise..." : "Create Franchise"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
