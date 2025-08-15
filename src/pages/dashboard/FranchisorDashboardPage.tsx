"use client";

import { useState } from "react";
// import { ProtectedRoute } from "@/components/protected-route";
// import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddBusinessModal } from "@/components/add-business-modal";
import {
  Building2,
  Users,
  Plus,
  Eye,
  MessageSquare,
  MapPin,
  Calendar,
  Star,
  FileText,
} from "lucide-react";
import { ChatSystem } from "@/components/chat";

export default function FranchisorDashboard() {
  //   const { user } = useAuth();
  const [isAddBusinessModalOpen, setIsAddBusinessModalOpen] = useState(false);

  // Mock data - replace with actual API calls
  const dashboardData = {
    totalFranchises: 24,
    activeFranchisees: 22,
    pendingApplications: 8,
    averageRating: 4.7,
  };

  const franchises: Franchise[] = [
    {
      id: 1,
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
    },
    {
      id: 2,
      owner: "bbbbb-aa",
      name: "TechKids Academy",
      categoryIds: [3],
      description:
        "STEM education franchise teaching coding and robotics to children aged 6-16.",
      startingPrice: 75000,
      foundedIn: new Date("2018-01-10").getTime(),
      totalOutlets: 20,
      legalEntity: "TechKids Inc.",
      minGrossProfit: 30000,
      maxGrossProfit: 90000,
      minNetProfit: 15000,
      maxNetProfit: 50000,
      isDepositRequired: false,
      royaltyFee: "3%",
      licenseDuration: { years: 3, months: 6 },
      coverImageUrl: "https://picsum.photos/200/401",
      productGallery: [
        "https://picsum.photos/402/300",
        "https://picsum.photos/403/300",
      ],
      contactNumber: "+44-1234-5678",
      contactEmail: "contact@techkids.com",
      locations: ["Global"],
      status: "Active",
      isVerified: true,
      reviewsCount: 156,
    },
    {
      id: 3,
      owner: "ccccc-aa",
      name: "FitZone Gym",
      categoryIds: [4],
      description:
        "Modern fitness center with state-of-the-art equipment and personal training.",
      startingPrice: 250000,
      foundedIn: new Date("2012-03-20").getTime(),
      totalOutlets: 60,
      legalEntity: "FitZone International",
      minGrossProfit: 80000,
      maxGrossProfit: 200000,
      minNetProfit: 40000,
      maxNetProfit: 120000,
      isDepositRequired: true,
      royaltyFee: "6%",
      licenseDuration: { years: 10, months: 0 },
      coverImageUrl: "https://picsum.photos/200/402",
      productGallery: [
        "https://picsum.photos/404/300",
        "https://picsum.photos/405/300",
      ],
      contactNumber: "+1-222-555-7890",
      contactEmail: "join@fitzone.com",
      locations: ["Los Angeles", "San Diego"],
      status: "Active",
      isVerified: true,
      reviewsCount: 89,
    },
  ];

  const recentApplications = [
    {
      id: 1,
      applicantName: "Sarah Johnson",
      franchise: "Green Leaf Cafe",
      location: "Portland, OR",
      date: "2024-01-20",
      status: "Under Review",
    },
    {
      id: 2,
      applicantName: "Mike Chen",
      franchise: "FitZone Gym",
      location: "Austin, TX",
      date: "2024-01-19",
      status: "Approved",
    },
    {
      id: 3,
      applicantName: "Emily Davis",
      franchise: "TechRepair Pro",
      location: "Denver, CO",
      date: "2024-01-18",
      status: "Pending Documents",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending Documents":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Franchisor Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your franchise network and connect with franchisees.
              </p>
            </div>
            <Button
              onClick={() => setIsAddBusinessModalOpen(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Business
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Franchises
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-600">
                  {dashboardData.totalFranchises}
                </div>
                <p className="text-xs text-muted-foreground">+2 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Franchisees
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-600">
                  {dashboardData.activeFranchisees}
                </div>
                <p className="text-xs text-muted-foreground">92% active rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Applications
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-600">
                  {dashboardData.pendingApplications}
                </div>
                <p className="text-xs text-muted-foreground">Requires review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Rating
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-600">
                  {dashboardData.averageRating}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all franchises
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="franchises" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="franchises">My Franchises</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="chat">Messages</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="franchises" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Franchise Listings
                  </CardTitle>
                  <CardDescription>
                    Manage your franchise opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {franchises.map((franchise) => (
                      <Card
                        key={franchise.id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">
                                {franchise.name}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {franchise.categoryIds.join(", ")}
                              </CardDescription>
                            </div>
                            <Badge className={getStatusColor(franchise.status)}>
                              {franchise.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={
                                franchise.coverImageUrl ||
                                "https://picsum.photos/300/200"
                              }
                              alt={franchise.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Investment:
                              </span>
                              <span className="font-medium">
                                ${franchise.startingPrice.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Locations:
                              </span>
                              <span className="font-medium">
                                {franchise.locations}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Reviews:
                              </span>
                              <span className="flex items-center gap-1 font-medium">
                                {franchise.reviewsCount}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <a
                              href={`/dashboard/franchisor/franchise/${franchise.id}`}
                              className="flex-1"
                            >
                              <Button
                                variant="outline"
                                className="w-full bg-transparent"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                            </a>
                            <Button variant="outline" size="icon">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Applications
                  </CardTitle>
                  <CardDescription>
                    Review and manage franchise applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentApplications.map((application) => (
                      <div
                        key={application.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">
                              {application.applicantName}
                            </h3>
                            <Badge
                              className={getStatusColor(application.status)}
                            >
                              {application.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span>Franchise: {application.franchise}</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {application.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {application.date}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="space-y-6">
              <ChatSystem userType="franchisor" />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Franchise Settings</CardTitle>
                  <CardDescription>
                    Manage your franchise network preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Franchise Terms & Conditions
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Franchisee Requirements
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Territory Management
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Document Templates
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AddBusinessModal
        isOpen={isAddBusinessModalOpen}
        onClose={() => setIsAddBusinessModalOpen(false)}
      />
    </div>
  );
}
