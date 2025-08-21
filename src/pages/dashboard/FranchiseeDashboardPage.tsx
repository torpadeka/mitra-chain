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
import { useUser } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import {
  FranchiseHandler,
  FrontendFranchise,
} from "@/handler/FranchiseHandler";
import {
  ApplicationHandler,
  FrontendApplication,
} from "@/handler/ApplicationHandler";
import { useNavigate, useParams } from "react-router";
import { protectedPage } from "@/context/ProtectedRoutes";
import { ApplicationsTab } from "@/components/application-tab-franchisee";
import { cp } from "fs";

interface ApplicationDetail {
  franchise: FrontendFranchise;
  application: FrontendApplication;
}

export default function FranchiseeDashboard() {
  const { actor, principal, loadFromSession } = useUser();
  const [franchises, setFranchises] = useState<FrontendFranchise[]>([]);
  const [applications, setApplications] = useState<FrontendApplication[]>([]);
  const [pendingFranchises, setPendingFranchises] = useState<
    FrontendFranchise[]
  >([]);
  const [pendingApplications, setPendingApplications] = useState<
    FrontendApplication[]
  >([]);
  const [combinePendingApplications, setCombinePendingApplications] = useState<
    ApplicationDetail[]
  >([]);
  const [loading, setLoading] = useState(false);
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();

  const defaultTab = conversationId ? "chat" : "franchises";

  useEffect(() => {
    if (!actor || !principal) {
      setFranchises([]);
      setApplications([]);
      return;
    }

    const session = loadFromSession();
    if (!session.user) {
      window.location.href = "/";
    } else if (!("Franchisee" in session.user.role)) {
      window.location.href = "/";
    }

    const fetchFranchises = async () => {
      setLoading(true);
      try {
        const franchiseHandler = new FranchiseHandler(actor);
        const applicationHandler = new ApplicationHandler(actor);

        const allApps = await applicationHandler.getApplicationsByApplicant(
          principal.toString()
        );

        console.log("All Applications:", allApps);

        const approvedApps = allApps.filter(
          (app) => app.status === "Approved" || app.status === "Completed"
        );
        const pendingApps = allApps.filter(
          (app) =>
            app.status === "Submitted" || app.status === "Pending Payment"
        );
        setApplications(approvedApps);
        setPendingApplications(pendingApps);

        const franchiseResults = await Promise.all(
          approvedApps.map((app) =>
            franchiseHandler.getFranchise(app.franchiseId)
          )
        );
        const pendingFranchiseResults = await Promise.all(
          pendingApps.map((app) =>
            franchiseHandler.getFranchise(app.franchiseId)
          )
        );

        setFranchises(
          franchiseResults.filter((fr): fr is FrontendFranchise => fr !== null)
        );
        console.log("Raw Pending Franchise Results:", pendingFranchiseResults);
        const pendingFranchiseResults2 = pendingFranchiseResults.filter(
          (fr): fr is FrontendFranchise => fr != null
        );
        setPendingFranchises(pendingFranchiseResults2);
        const combined: ApplicationDetail[] = pendingApps
          .map((app) => {
            const franchise = pendingFranchiseResults2.find(
              (f) => f.id == app.franchiseId
            );
            if (!franchise) return null; // no matching franchise
            return { franchise, application: app };
          })
          .filter((item): item is ApplicationDetail => item !== null);
        console.log(combined);

        setCombinePendingApplications(combined);
      } catch (error) {
        setFranchises([]);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFranchises();
  }, [actor, principal]);

  const totalRevenue = franchises.reduce((sum, franchise) => {
    const revenue = franchise.minNetProfit ?? 0;
    return sum + revenue / 12;
  }, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Pending Payment":
        return "bg-yellow-100 text-yellow-700";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  } else {
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

            <Tabs defaultValue={defaultTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="franchises">My Franchises</TabsTrigger>
                <TabsTrigger value="pending">Pending Franchises</TabsTrigger>
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
                      <FranchiseCard franchise={franchise} key={franchise.id} />
                    ))}
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common tasks and resources
                    </CardDescription>
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

              <TabsContent value="pending" className="space-y-6">
                <ApplicationsTab
                  getStatusColor={getStatusColor}
                  applicationDetails={combinePendingApplications}
                />
              </TabsContent>

              <TabsContent value="chat" className="space-y-6">
                <ChatSystem
                  userType="franchisee"
                  currentChat={conversationId}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}
