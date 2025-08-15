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
import { FranchiseCard } from "@/components/franchise-card-dash";

export default function FranchiseeDashboard() {
  // const { user } = useAuth();

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

  const totalRevenue = franchises.reduce((sum, franchise) => {
    const revenue = franchise.minNetProfit ?? 0;
    return sum + revenue / 12;
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
                    <FranchiseCard franchise={franchise} />
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
