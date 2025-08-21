"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, MapPin, Users, ImageIcon, ArrowLeft } from "lucide-react";
import { useUser } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EventHandler } from "@/handler/EventHandler";

type EventCategory =
  | "Expo"
  | "Webinar"
  | "Workshop"
  | "Networking"
  | "Bazaar"
  | "DiscoveryDay";
type LocationType = "online" | "physical";
type RegistrationMode = "Open" | "InviteOnly";

interface EventFormData {
  title: string;
  category: EventCategory | "";
  description: string;
  startTime: string;
  endTime: string;
  locationType: LocationType;
  onlineUrl: string;
  physicalAddress: string;
  physicalCity: string;
  imageUrl: string;
  featuredFranchises: number[];
  registrationMode: RegistrationMode;
}

export default function CreateEventPage() {
  const { user, actor } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    category: "",
    description: "",
    startTime: "",
    endTime: "",
    locationType: "online",
    onlineUrl: "",
    physicalAddress: "",
    physicalCity: "",
    imageUrl: "",
    featuredFranchises: [],
    registrationMode: "Open",
  });

  // Mock franchise data - in real app, this would come from API
  const availableFranchises = [
    { id: 1, name: "Green Leaf Cafe" },
    { id: 2, name: "FitZone Gym" },
    { id: 3, name: "EduSmart Learning Center" },
    { id: 4, name: "AutoCare Service" },
    { id: 5, name: "CleanPro Services" },
  ];

  const handleInputChange = (
    field: keyof EventFormData,
    value: string | number[] | LocationType | RegistrationMode
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
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
      handleInputChange("imageUrl", data.secure_url);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setImageUploading(false);
    }
  };

  const handleFranchiseToggle = (franchiseId: number) => {
    const currentFranchises = formData.featuredFranchises;
    const updatedFranchises = currentFranchises.includes(franchiseId)
      ? currentFranchises.filter((id) => id !== franchiseId)
      : [...currentFranchises, franchiseId];

    handleInputChange("featuredFranchises", updatedFranchises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !actor) return;

    const eventHandler = new EventHandler(actor);

    setIsSubmitting(true);
    try {
      const eventData = {
        organizerPrincipal: user.principal, // Assuming user has an id field
        title: formData.title,
        category: formData.category,
        description: formData.description,
        startTime: new Date(formData.startTime),
        endTime: new Date(formData.endTime),
        location:
          formData.locationType === "online"
            ? { Online: formData.onlineUrl }
            : {
                Physical: {
                  address: formData.physicalAddress,
                  city: formData.physicalCity,
                },
              },
        imageUrl: formData.imageUrl,
        featuredFranchises: formData.featuredFranchises,
        attendees: [],
        registrationMode: formData.registrationMode,
        createdAt: new Date(),
      };

      console.log("Event data to submit:", eventData);

      // Simulate API call
      eventHandler.createNewEvent(
        formData.title,
        formData.category as EventCategory,
        formData.description,
        new Date(formData.startTime),
        new Date(formData.endTime),
        formData.locationType === "online"
          ? { Online: formData.onlineUrl }
          : {
              Physical: {
                address: formData.physicalAddress,
                city: formData.physicalCity,
              },
            },
        formData.imageUrl,
        formData.featuredFranchises,
        formData.registrationMode as RegistrationMode
      );

      navigate("/events");
    } catch (error) {
      console.error("Failed to create event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-secondary mb-4">
              Please sign in to create events
            </p>
            <Button asChild className="w-full">
              <a href="/auth/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/events"
            className="inline-flex items-center text-brand hover:text-brand-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </a>
          <h1 className="text-3xl font-serif font-bold text-primary">
            Create New Event
          </h1>
          <p className="text-secondary mt-2">
            Organize franchise events, workshops, and networking opportunities
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-brand" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value as EventCategory)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Expo">Franchise Expo</SelectItem>
                    <SelectItem value="Webinar">Webinar</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Networking">Networking Event</SelectItem>
                    <SelectItem value="Bazaar">Business Bazaar</SelectItem>
                    <SelectItem value="DiscoveryDay">Discovery Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe your event, agenda, and what attendees can expect"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Date & Time *</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) =>
                      handleInputChange("startTime", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Date & Time *</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) =>
                      handleInputChange("endTime", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-brand" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Event Type *</Label>
                <RadioGroup
                  value={formData.locationType}
                  onValueChange={(value: any) =>
                    handleInputChange("locationType", value as LocationType)
                  }
                  className="flex space-x-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online">Online Event</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="physical" id="physical" />
                    <Label htmlFor="physical">Physical Location</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.locationType === "online" ? (
                <div>
                  <Label htmlFor="onlineUrl">Meeting URL *</Label>
                  <Input
                    id="onlineUrl"
                    value={formData.onlineUrl}
                    onChange={(e) =>
                      handleInputChange("onlineUrl", e.target.value)
                    }
                    placeholder="https://zoom.us/j/... or meeting platform URL"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="physicalAddress">Address *</Label>
                    <Input
                      id="physicalAddress"
                      value={formData.physicalAddress}
                      onChange={(e) =>
                        handleInputChange("physicalAddress", e.target.value)
                      }
                      placeholder="Street address and venue name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="physicalCity">City *</Label>
                    <Input
                      id="physicalCity"
                      value={formData.physicalCity}
                      onChange={(e) =>
                        handleInputChange("physicalCity", e.target.value)
                      }
                      placeholder="City, State/Province"
                      required
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-brand" />
                Event Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="eventImage">Upload Event Banner</Label>
                  <Input
                    id="eventImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                  />
                  {imageUploading && (
                    <p className="text-sm text-secondary">Uploading image...</p>
                  )}
                </div>
                {formData.imageUrl && (
                  <div className="mt-4">
                    <img
                      src={formData.imageUrl || "https://picsum.photos/300/200"}
                      alt="Event preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Featured Franchises */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-brand" />
                Featured Franchises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-secondary">
                  Select franchises to feature at this event
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableFranchises.map((franchise) => (
                    <div
                      key={franchise.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`franchise-${franchise.id}`}
                        checked={formData.featuredFranchises.includes(
                          franchise.id
                        )}
                        onCheckedChange={() =>
                          handleFranchiseToggle(franchise.id)
                        }
                      />
                      <Label
                        htmlFor={`franchise-${franchise.id}`}
                        className="text-sm"
                      >
                        {franchise.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Registration Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Registration Mode *</Label>
                <RadioGroup
                  value={formData.registrationMode}
                  onValueChange={(value) =>
                    handleInputChange(
                      "registrationMode",
                      value as RegistrationMode
                    )
                  }
                  className="flex space-x-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Open" id="open" />
                    <Label htmlFor="open">Open Registration</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="InviteOnly" id="invite" />
                    <Label htmlFor="invite">Invite Only</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" asChild>
              <a href="/events">Cancel</a>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.category}
              className="btn-primary"
            >
              {isSubmitting ? "Creating Event..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
