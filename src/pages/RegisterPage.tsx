"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Store,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { useUser } from "@/context/AuthContext";
import type { Role } from "@/declarations/backend/backend.did";
import NoPP from "../assets/no_pp.webp";
import { useNavigate } from "react-router";

interface FormData {
  name: string;
  email: string;
  bio: string;
  address: string;
  phoneNumber: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  terms?: string;
  address?: string;
  phoneNumber?: string;
}

interface FieldValidation {
  name: boolean;
  email: boolean;
  terms: boolean;
  address: boolean;
  phoneNumber: boolean;
}

export default function RegisterPage() {
  const { actor, createUser, login, whoami, user } = useUser();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<
    "franchisee" | "franchisor" | "admin"
  >("franchisee");
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    bio: "",
    address: "",
    phoneNumber: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [fieldValidation, setFieldValidation] = useState<FieldValidation>({
    name: false,
    email: false,
    terms: false,
    address: false,
    phoneNumber: false,
  });
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [whoamiResult, setWhoamiResult] = useState<string>("Loading...");

  useEffect(() => {
    const fetchWhoami = async () => {
      if (!actor) {
        setWhoamiResult("Actor not available");
        return;
      }
      try {
        const result = await whoami();
        setWhoamiResult(result);
      } catch (error) {
        console.error("Whoami call failed:", error);
        setWhoamiResult("Failed to fetch whoami");
      }
    };

    fetchWhoami();
  }, [actor, whoami]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const validateField = (
    fieldName: string,
    value: string | boolean
  ): string | undefined => {
    switch (fieldName) {
      case "name":
        if (typeof value === "string" && !value.trim()) {
          return "Full Name is required";
        }
        return undefined;
      case "email":
        if (typeof value === "string") {
          if (!value.trim()) {
            return "Email is required";
          } else if (!/\S+@\S+\.\S+/.test(value)) {
            return "Please enter a valid email address";
          }
        }
        return undefined;
      case "terms":
        if (typeof value === "boolean" && !value) {
          return "You must agree to the Terms of Service and Privacy Policy";
        }
        return undefined;
      case "address":
        if (
          userType === "franchisor" &&
          typeof value === "string" &&
          !value.trim()
        ) {
          return "Address is required for Franchisors";
        }
        return undefined;
      case "phoneNumber":
        if (
          userType === "franchisor" &&
          typeof value === "string" &&
          !value.trim()
        ) {
          return "Phone Number is required for Franchisors";
        }
        return undefined;
      default:
        return undefined;
    }
  };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};

    const nameError = validateField("name", formData.name);
    if (nameError) errors.name = nameError;

    const emailError = validateField("email", formData.email);
    if (emailError) errors.email = emailError;

    const termsError = validateField("terms", acceptTerms);
    if (termsError) errors.terms = termsError;

    const addressError = validateField("address", formData.address);
    if (addressError) errors.address = addressError;

    const phoneNumberError = validateField("phoneNumber", formData.phoneNumber);
    if (phoneNumberError) errors.phoneNumber = phoneNumberError;

    return errors;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setTouchedFields((prev) => new Set(prev).add(name));

    const error = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error }));

    setFieldValidation((prev) => ({
      ...prev,
      [name]: !error,
    }));
  };

  const handleTermsChange = (checked: boolean) => {
    setAcceptTerms(checked);
    setTouchedFields((prev) => new Set(prev).add("terms"));

    const error = validateField("terms", checked);
    setFormErrors((prev) => ({ ...prev, terms: error }));
    setFieldValidation((prev) => ({ ...prev, terms: !error }));
  };

  const handleFieldBlur = (fieldName: string) => {
    setTouchedFields((prev) => new Set(prev).add(fieldName));

    let value: string | boolean;
    if (fieldName === "terms") {
      value = acceptTerms;
    } else {
      value = formData[fieldName as keyof FormData];
    }

    const error = validateField(fieldName, value);
    setFormErrors((prev) => ({ ...prev, [fieldName]: error }));
    setFieldValidation((prev) => ({ ...prev, [fieldName]: !error }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", "mitra-chain");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dsl9fmscw/image/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        setProfilePicUrl(data.secure_url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeProfilePic = () => {
    setProfilePicUrl("");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const fieldsToValidate = ["name", "email", "terms"];
    if (userType === "franchisor") {
      fieldsToValidate.push("address", "phoneNumber");
    }
    setTouchedFields(new Set(fieldsToValidate));

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const roleVariant: Role =
      userType === "franchisee"
        ? { Franchisee: null }
        : userType === "franchisor"
          ? { Franchisor: null }
          : { Admin: null };

    const userData = {
      name: formData.name,
      email: formData.email,
      bio: formData.bio,
      role: userType,
      profilePicUrl: profilePicUrl || "",
    };

    await createUser(
      userData.name,
      userData.email,
      userData.bio,
      roleVariant,
      userData.profilePicUrl,
      undefined, // linkedin
      undefined, // instagram
      undefined, // twitter
      userType === "franchisor" ? formData.address : undefined,
      userType === "franchisor" ? formData.phoneNumber : undefined
    );

    window.location.reload();
    window.location.href = "/";
  };

  const getFieldStatusIcon = (fieldName: string) => {
    if (!touchedFields.has(fieldName)) return null;

    const hasError = formErrors[fieldName as keyof FormErrors];
    const isValid = fieldValidation[fieldName as keyof FieldValidation];

    if (hasError) {
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    } else if (isValid) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Create Account
          </CardTitle>
          <CardDescription>
            Join the MitraChain franchise marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={userType}
            onValueChange={(value) =>
              setUserType(value as "franchisee" | "franchisor" | "admin")
            }
            className="mb-6"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="franchisee"
                className="flex items-center gap-2"
              >
                <Store className="h-4 w-4" />
                Franchisee
              </TabsTrigger>
              <TabsTrigger
                value="franchisor"
                className="flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" />
                Franchisor
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-4">
                {profilePicUrl ? (
                  <div className="relative">
                    <img
                      src={profilePicUrl || NoPP}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="rounded-full object-cover border-2 border-border w-20 h-20"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={removeProfilePic}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-muted">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="cursor-pointer"
                  />
                  {isUploading && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Uploading...
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={() => handleFieldBlur("name")}
                  required
                  aria-required="true"
                  className={`pr-10 ${
                    touchedFields.has("name") && formErrors.name
                      ? "border-destructive focus-visible:ring-destructive"
                      : touchedFields.has("name") && fieldValidation.name
                        ? "border-green-500 focus-visible:ring-green-500"
                        : ""
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {getFieldStatusIcon("name")}
                </div>
              </div>
              {touchedFields.has("name") && formErrors.name && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {formErrors.name}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={() => handleFieldBlur("email")}
                  required
                  aria-required="true"
                  className={`pr-10 ${
                    touchedFields.has("email") && formErrors.email
                      ? "border-destructive focus-visible:ring-destructive"
                      : touchedFields.has("email") && fieldValidation.email
                        ? "border-green-500 focus-visible:ring-green-500"
                        : ""
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {getFieldStatusIcon("email")}
                </div>
              </div>
              {touchedFields.has("email") && formErrors.email && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {formErrors.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself and your business interests..."
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                className="resize-none"
              />
            </div>

            {userType === "franchisor" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="address">
                    Address <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="address"
                      name="address"
                      placeholder="123 Business Street, City, State, ZIP"
                      value={formData.address}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur("address")}
                      required
                      aria-required="true"
                      className={`pr-10 ${
                        touchedFields.has("address") && formErrors.address
                          ? "border-destructive focus-visible:ring-destructive"
                          : touchedFields.has("address") &&
                              fieldValidation.address
                            ? "border-green-500 focus-visible:ring-green-500"
                            : ""
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {getFieldStatusIcon("address")}
                    </div>
                  </div>
                  {touchedFields.has("address") && formErrors.address && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.address}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur("phoneNumber")}
                      required
                      aria-required="true"
                      className={`pr-10 ${
                        touchedFields.has("phoneNumber") &&
                        formErrors.phoneNumber
                          ? "border-destructive focus-visible:ring-destructive"
                          : touchedFields.has("phoneNumber") &&
                              fieldValidation.phoneNumber
                            ? "border-green-500 focus-visible:ring-green-500"
                            : ""
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {getFieldStatusIcon("phoneNumber")}
                    </div>
                  </div>
                  {touchedFields.has("phoneNumber") &&
                    formErrors.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.phoneNumber}
                      </div>
                    )}
                </div>
              </>
            )}

            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={handleTermsChange}
                  required
                  aria-required="true"
                  className={`mt-0.5 ${
                    touchedFields.has("terms") && formErrors.terms
                      ? "border-destructive data-[state=checked]:bg-destructive"
                      : touchedFields.has("terms") && fieldValidation.terms
                        ? "border-green-500 data-[state=checked]:bg-green-500"
                        : ""
                  }`}
                />
                <div className="flex-1">
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    I agree to the{" "}
                    <a href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                    <span className="text-destructive"> *</span>
                  </Label>
                </div>
                <div className="mt-0.5">{getFieldStatusIcon("terms")}</div>
              </div>
              {touchedFields.has("terms") && formErrors.terms && (
                <div className="flex items-center gap-2 text-sm text-destructive ml-6">
                  <AlertCircle className="h-4 w-4" />
                  {formErrors.terms}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!acceptTerms || isUploading}
            >
              Create{" "}
              {userType === "franchisee"
                ? "Franchisee"
                : userType === "franchisor"
                  ? "Franchisor"
                  : "Admin"}{" "}
              Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 text-primary h-auto"
                onClick={login}
              >
                Sign in
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
