"use client";

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
// import { ChatSystem } from "@/components/chat-system";
import {
  Store,
  MessageSquare,
  Plus,
  MapPin,
  Calendar,
  TrendingUp,
  Eye,
} from "lucide-react";
import { ChatSystem } from "@/components/chat";

export default function FranchiseeDashboard() {
  // const { user } = useAuth();

  const franchises = [
    {
      id: "1",
      name: "Green Leaf Cafe",
      location: "Downtown Seattle, WA",
      licenseNumber: "GLC-2024-001",
      status: "Active",
      startDate: "January 15, 2024",
      monthlyRevenue: "$45,000",
      category: "Food & Beverage",
      image: "/cafe-franchise.png",
    },
    {
      id: "2",
      name: "FitZone Gym",
      location: "Bellevue, WA",
      licenseNumber: "FZG-2024-002",
      status: "Active",
      startDate: "March 10, 2024",
      monthlyRevenue: "$32,000",
      category: "Fitness",
      image: "/gym-franchise.png",
    },
    {
      id: "3",
      name: "TechLearn Academy",
      location: "Redmond, WA",
      licenseNumber: "TLA-2024-003",
      status: "Pending Setup",
      startDate: "May 1, 2024",
      monthlyRevenue: "$0",
      category: "Education",
      image: "/education-franchise.png",
    },
  ];

  const totalRevenue = franchises.reduce((sum, franchise) => {
    const revenue = Number.parseInt(
      franchise.monthlyRevenue.replace(/[$,]/g, "")
    );
    return sum + revenue;
  }, 0);

  return (
    <div>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, Users!
            </h1>
            <p className="text-muted-foreground">
              Manage your franchises and stay connected with your franchisors.
            </p>
          </div>

          <Tabs defaultValue="franchises" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="franchises">My Franchises</TabsTrigger>
              <TabsTrigger value="chat">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="franchises" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Total Franchises
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {franchises.length}
                        </p>
                      </div>
                      <Store className="h-8 w-8 text-brand-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Active Franchises
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {
                            franchises.filter((f) => f.status === "Active")
                              .length
                          }
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Total Monthly Revenue
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          ${totalRevenue.toLocaleString()}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-brand-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    Your Franchises
                  </h2>
                  <Button className="bg-brand-600 hover:bg-brand-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Browse New Franchises
                  </Button>
                </div>

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
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {franchise.location}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={
                              franchise.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              franchise.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : ""
                            }
                          >
                            {franchise.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={franchise.image || "/placeholder.svg"}
                            alt={franchise.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Category:
                            </span>
                            <span className="font-medium">
                              {franchise.category}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              License:
                            </span>
                            <span className="font-mono text-xs">
                              {franchise.licenseNumber}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Monthly Revenue:
                            </span>
                            <span className="font-medium text-green-600">
                              {franchise.monthlyRevenue}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Start Date:
                            </span>
                            <span>{franchise.startDate}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <a
                            href={`/dashboard/franchisee/franchise/${franchise.id}`}
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
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <a href="/franchises">
                      <Button
                        variant="outline"
                        className="h-20 flex-col bg-transparent w-full"
                      >
                        <Plus className="w-6 h-6 mb-2" />
                        <span className="text-sm">Browse Franchises</span>
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      className="h-20 flex-col bg-transparent"
                    >
                      <Calendar className="w-6 h-6 mb-2" />
                      <span className="text-sm">Schedule Training</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex-col bg-transparent"
                    >
                      <MessageSquare className="w-6 h-6 mb-2" />
                      <span className="text-sm">Contact Support</span>
                    </Button>
                    <a href="/profile">
                      <Button
                        variant="outline"
                        className="h-20 flex-col bg-transparent w-full"
                      >
                        <Store className="w-6 h-6 mb-2" />
                        <span className="text-sm">My Profile</span>
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="space-y-6">
              <ChatSystem userType="franchisee" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
