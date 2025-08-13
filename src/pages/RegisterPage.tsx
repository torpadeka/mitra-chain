"use client";

import type React from "react";
import { useState } from "react";
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
import { Eye, EyeOff, Building2, Store, Upload, X } from "lucide-react";
import { useUser } from "@/context/AuthContext";
import { Role } from "@/declarations/backend/backend.did";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { createUser, login } = useUser();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<"franchisee" | "franchisor">(
    "franchisee"
  );
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

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

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    let roleVariant: Role;
    if (userType === "franchisee") roleVariant = { Franchisee: null };
    else if (userType === "franchisor") roleVariant = { Franchisor: null };
    else if (userType === "admin") roleVariant = { Admin: null };
    else throw new Error("Invalid role");

    const userData = {
      name: formData.name,
      email: formData.email,
      bio: formData.bio,
      role: userType,
      profilePicUrl: profilePicUrl || "",
    };

    console.log("Signup attempt:", userData);
    createUser(
      userData.name,
      userData.email,
      userData.bio,
      roleVariant,
      userData.profilePicUrl
    );
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
              setUserType(value as "franchisee" | "franchisor")
            }
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger
                value="Franchisee"
                className="flex items-center gap-2"
              >
                <Store className="h-4 w-4" />
                Franchisee
              </TabsTrigger>
              <TabsTrigger
                value="Franchisor"
                className="flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" />
                Franchisor
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSignup} className="space-y-4">
              {/* Profile Picture Upload */}
              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-4">
                  {profilePicUrl ? (
                    <div className="relative">
                      <img
                        src={profilePicUrl || "/placeholder.svg"}
                        alt="Profile"
                        width={80}
                        height={80}
                        className="rounded-full object-cover border-2 border-border"
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

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Bio Field */}
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

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) =>
                    setAcceptTerms(checked as boolean)
                  }
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <a href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!acceptTerms || isUploading}
              >
                Create {userType === "franchisee" ? "Franchisee" : "Franchisor"}{" "}
                Account
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <div
                className="text-primary hover:underline"
                onClick={() => {
                  login();
                }}
              >
                Sign in
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
