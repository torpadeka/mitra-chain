"use client";

import type React from "react";
import { useUser } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Mail,
  User,
  MapPin,
  Phone,
  Linkedin,
  Instagram,
  Twitter,
  Upload,
  Loader2,
} from "lucide-react";

export default function ProfilePage() {
  const { user, updateFranchisorProfile, updateFranchiseeProfile, logout } =
    useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !isEditing) {
      setName(user.name || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
      setProfilePicUrl(user.profilePicUrl || "");
      setLinkedin(user.linkedin || "");
      setInstagram(user.instagram || "");
      setTwitter(user.twitter || "");
      setAddress(user.address || "");
      setPhoneNumber(user.phoneNumber || "");
    }
    setLoading(user === null ? true : false);
  }, [user, isEditing]);

  useEffect(() => {
    if (user === null) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Navigation will handle redirect
  }

  // Prevent form submission on Enter key
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter
    }
  };

  // Handle image upload to Cloudinary
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
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("save");
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let updatedUser: any;
      if (user?.role === "Franchisor") {
        if (!address || !phoneNumber) {
          console.error("Address and phone number are required for Franchisor");
          return;
        }
        updatedUser = await updateFranchisorProfile(
          bio,
          profilePicUrl,
          linkedin,
          instagram,
          twitter,
          address,
          phoneNumber
        );
      } else if (user?.role === "Franchisee") {
        updatedUser = await updateFranchiseeProfile(bio, profilePicUrl);
      } else {
        // Admin: only update bio and profile picture
        updatedUser = await updateFranchiseeProfile(bio, profilePicUrl);
      }

      if (updatedUser) {
        setIsEditing(false);
      } else {
        throw new Error("Profile update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout(() => navigate("/login"));
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Franchisor":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Franchisee":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Admin":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="pb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={profilePicUrl || "/default-profile.png"}
                    alt="Profile Picture"
                  />
                  <AvatarFallback className="text-2xl font-semibold">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
              </div>

              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.name}
                  </h2>
                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    Joined {user.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {!isEditing ? (
                  <>
                    <Button
                      onClick={() => {
                        setIsEditing(true);
                      }}
                      className="gap-2"
                    >
                      <User className="h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="submit"
                      form="profile-form"
                      disabled={isUploading || isSubmitting}
                      className="gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form fields
                        setName(user.name || "");
                        setEmail(user.email || "");
                        setBio(user.bio || "");
                        setProfilePicUrl(user.profilePicUrl || "");
                        setLinkedin(user.linkedin || "");
                        setInstagram(user.instagram || "");
                        setTwitter(user.twitter || "");
                        setAddress(user.address || "");
                        setPhoneNumber(user.phoneNumber || "");
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <form
              id="profile-form"
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {isEditing && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Profile Picture
                  </h3>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="max-w-xs"
                    />
                    {isUploading && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="principal" className="text-sm font-medium">
                      Principal ID
                    </Label>
                    <Input
                      id="principal"
                      value={user.principal}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">
                      Role
                    </Label>
                    <Input
                      id="role"
                      value={user.role}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={handleKeyDown} // Add keydown handler
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handleKeyDown} // Add keydown handler
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    onKeyDown={handleKeyDown} // Add keydown handler
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
              </div>

              {(user.role === "Franchisor" || user.role === "Admin") && (
                <>
                  <Separator />
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Contact Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="address"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <MapPin className="h-4 w-4" />
                          Address{" "}
                          {user.role === "Franchisor" && (
                            <span className="text-red-500">*</span>
                          )}
                        </Label>
                        <Input
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          onKeyDown={handleKeyDown} // Add keydown handler
                          disabled={!isEditing}
                          required={user.role === "Franchisor"}
                          className={!isEditing ? "bg-muted" : ""}
                          placeholder="Enter your address"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="phoneNumber"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <Phone className="h-4 w-4" />
                          Phone Number{" "}
                          {user.role === "Franchisor" && (
                            <span className="text-red-500">*</span>
                          )}
                        </Label>
                        <Input
                          id="phoneNumber"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          onKeyDown={handleKeyDown} // Add keydown handler
                          disabled={!isEditing}
                          required={user.role === "Franchisor"}
                          className={!isEditing ? "bg-muted" : ""}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">
                      Social Media Links
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="linkedin"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <Linkedin className="h-4 w-4" />
                          LinkedIn
                        </Label>
                        <Input
                          id="linkedin"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          onKeyDown={handleKeyDown} // Add keydown handler
                          disabled={!isEditing}
                          className={!isEditing ? "bg-muted" : ""}
                          placeholder="LinkedIn profile URL"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="instagram"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <Instagram className="h-4 w-4" />
                          Instagram
                        </Label>
                        <Input
                          id="instagram"
                          value={instagram}
                          onChange={(e) => setInstagram(e.target.value)}
                          onKeyDown={handleKeyDown} // Add keydown handler
                          disabled={!isEditing}
                          className={!isEditing ? "bg-muted" : ""}
                          placeholder="Instagram profile URL"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="twitter"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <Twitter className="h-4 w-4" />
                          Twitter
                        </Label>
                        <Input
                          id="twitter"
                          value={twitter}
                          onChange={(e) => setTwitter(e.target.value)}
                          onKeyDown={handleKeyDown} // Add keydown handler
                          disabled={!isEditing}
                          className={!isEditing ? "bg-muted" : ""}
                          placeholder="Twitter profile URL"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
