"use client";

import { useState } from "react";
// import { ProtectedRoute } from "@/components/protected-route";
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
  ArrowLeft,
  Building2,
  Users,
  Edit,
  MessageSquare,
  MapPin,
  Star,
  FileText,
  Calendar,
  TrendingUp,
  DollarSign,
  Eye,
  Phone,
} from "lucide-react";
import { useParams } from "react-router";

export default function FranchisorFranchiseDetailPage() {
  const params = useParams();
  const franchiseId = params.id;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mock data - replace with actual API calls based on franchiseId
  const franchiseData = {
    id: franchiseId,
    name: "Green Leaf Cafe",
    category: "Food & Beverage",
    investment: "$50,000 - $100,000",
    locations: 12,
    status: "Active",
    rating: 4.8,
    applications: 5,
    image: "/cafe-franchise.png",
    description:
      "A premium coffee franchise offering artisanal beverages and fresh pastries in a cozy atmosphere.",
    features: [
      "Training Program",
      "Marketing Support",
      "Site Selection",
      "Equipment Package",
    ],
    requirements: [
      "$75,000 liquid capital",
      "Business experience preferred",
      "Passion for coffee culture",
    ],
    territory: "Exclusive 3-mile radius",
    royaltyFee: "6%",
    franchiseFee: "$45,000",
    totalInvestment: "$150,000 - $250,000",
  };

  const franchiseeLocations = [
    {
      id: 1,
      franchiseeName: "Sarah Johnson",
      location: "Downtown Seattle, WA",
      status: "Active",
      openDate: "Jan 2024",
      monthlyRevenue: "$45,000",
      rating: 4.9,
    },
    {
      id: 2,
      franchiseeName: "Mike Chen",
      location: "Portland, OR",
      status: "Active",
      openDate: "Mar 2024",
      monthlyRevenue: "$38,000",
      rating: 4.7,
    },
    {
      id: 3,
      franchiseeName: "Emily Davis",
      location: "Bellevue, WA",
      status: "Opening Soon",
      openDate: "May 2024",
      monthlyRevenue: "$0",
      rating: 0,
    },
  ];

  const recentApplications = [
    {
      id: 1,
      applicantName: "John Smith",
      location: "Austin, TX",
      date: "2024-01-20",
      status: "Under Review",
      investment: "$180,000",
    },
    {
      id: 2,
      applicantName: "Lisa Wang",
      location: "Denver, CO",
      date: "2024-01-19",
      status: "Approved",
      investment: "$165,000",
    },
    {
      id: 3,
      applicantName: "Robert Brown",
      location: "Phoenix, AZ",
      date: "2024-01-18",
      status: "Pending Documents",
      investment: "$175,000",
    },
  ];

  const performanceMetrics = [
    { label: "Total Revenue", value: "$1.2M", change: "+15%", trend: "up" },
    { label: "Average Rating", value: "4.8/5", change: "+0.1", trend: "up" },
    { label: "Active Locations", value: "12", change: "+2", trend: "up" },
    { label: "Application Rate", value: "85%", change: "+5%", trend: "up" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Opening Soon":
        return "bg-blue-100 text-blue-800";
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
          <div className="mb-8">
            <a
              href="/dashboard/franchisor"
              className="inline-flex items-center text-brand-600 hover:text-brand-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </a>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {franchiseData.name}
                </h1>
                <p className="text-muted-foreground">
                  {franchiseData.category}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(franchiseData.status)}>
                  {franchiseData.status}
                </Badge>
                <Button
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-brand-600 hover:bg-brand-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Franchise
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Franchise Image and Details */}
                <Card>
                  <CardContent className="p-6">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                      <img
                        src={franchiseData.image || "/placeholder.svg"}
                        alt={franchiseData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">{franchiseData.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {franchiseData.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Franchise Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Investment Range:
                      </span>
                      <span className="text-sm font-semibold">
                        {franchiseData.investment}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Franchise Fee:
                      </span>
                      <span className="text-sm">
                        {franchiseData.franchiseFee}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Royalty Fee:</span>
                      <span className="text-sm">
                        {franchiseData.royaltyFee}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Territory:</span>
                      <span className="text-sm">{franchiseData.territory}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Active Locations:
                      </span>
                      <span className="text-sm font-semibold text-brand-600">
                        {franchiseData.locations}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Average Rating:
                      </span>
                      <span className="flex items-center gap-1 text-sm">
                        <Star className="w-3 h-3 fill-current text-yellow-500" />
                        {franchiseData.rating}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Features and Requirements */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What We Provide</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {franchiseData.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {franchiseData.requirements.map((requirement, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                          <span className="text-sm">{requirement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="locations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Franchisee Locations
                  </CardTitle>
                  <CardDescription>
                    Manage your franchise network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {franchiseeLocations.map((location) => (
                      <div
                        key={location.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">
                              {location.franchiseeName}
                            </h3>
                            <Badge className={getStatusColor(location.status)}>
                              {location.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {location.location}
                            </span>
                            <span>Opened: {location.openDate}</span>
                            <span>Revenue: {location.monthlyRevenue}</span>
                            {location.rating > 0 && (
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current text-yellow-500" />
                                {location.rating}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
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

            <TabsContent value="applications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Applications
                  </CardTitle>
                  <CardDescription>
                    Review applications for this franchise
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
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {application.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {application.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {application.investment}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {performanceMetrics.map((metric, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {metric.label}
                          </p>
                          <p className="text-2xl font-bold text-foreground">
                            {metric.value}
                          </p>
                          <p
                            className={`text-sm ${metric.trend === "up" ? "text-green-600" : metric.trend === "down" ? "text-red-600" : "text-muted-foreground"}`}
                          >
                            {metric.change}
                          </p>
                        </div>
                        <TrendingUp
                          className={`h-8 w-8 ${metric.trend === "up" ? "text-green-500" : metric.trend === "down" ? "text-red-500" : "text-gray-400"}`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>
                    Key metrics for this franchise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-8 w-8 text-green-600" />
                        <div>
                          <h4 className="font-medium">Revenue Performance</h4>
                          <p className="text-sm text-muted-foreground">
                            15% above industry average
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        Excellent
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium">
                            Franchisee Satisfaction
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            4.8/5 average rating
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="default"
                        className="bg-blue-100 text-blue-800"
                      >
                        Great
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Franchise Settings</CardTitle>
                  <CardDescription>
                    Manage settings for this franchise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Update Franchise Documents
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
                    <DollarSign className="w-4 h-4 mr-2" />
                    Fee Structure
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Franchisee Requirements
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AddBusinessModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        // editMode={true}
        // franchiseData={franchiseData}
      />
    </div>
  );
}
