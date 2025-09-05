"use client";

import { useEffect, useState } from "react";
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
  Text,
  Notebook,
} from "lucide-react";
import { ChatSystem } from "@/components/chat";
import { useUser } from "@/context/AuthContext";
import {
  FranchiseHandler,
  FrontendFranchise,
} from "@/handler/FranchiseHandler";
import {
  ApplicationHandler,
  FrontendApplication,
} from "@/handler/ApplicationHandler";
import { ApplicationsTab } from "@/components/application-tab";
import { protectedPage } from "@/context/ProtectedRoutes";
import { useNavigate } from "react-router";
import { AddFranchiseModal } from "@/components/add-franchise-modal";
import { stringToPrincipal } from "@/lib/utils";

interface ApplicationDetails {
  application: FrontendApplication;
  franchise: FrontendFranchise;
}

export default function FranchisorDashboard() {
  //   const { user } = useAuth();
  const [isAddBusinessModalOpen, setIsAddBusinessModalOpen] = useState(false);

  const { actor, principal, loadFromSession } = useUser();
  const [franchises, setFranchises] = useState<FrontendFranchise[]>([]);
  const [recentApplications, setRecentApplications] = useState<
    FrontendApplication[]
  >([]);
  const [applicationDetails, setApplicationDetails] = useState<
    ApplicationDetails[]
  >([]);
  const navigate = useNavigate();

  const session = loadFromSession();
  console.log("Session:", session);
  if (!session.user) {
    window.location.href = "/";
  } else if (!("Franchisor" === session.user.role)) {
    window.location.href = "/";
  }

  useEffect(() => {
    if (!actor || !principal) {
      setFranchises([]);
      return;
    }

    const fetchAll = async () => {
      setFranchises((prev) => ({ ...prev, loading: true }));
      try {
        const franchiseHandler = new FranchiseHandler(actor);
        const franchise = await franchiseHandler.getFranchiseByOwner(
          stringToPrincipal(principal)
        );
        setFranchises(franchise);
        const applicationHandler = new ApplicationHandler(actor);
        const applications = await applicationHandler.getApplicationsByOwner(
          principal.toString()
        );
        setRecentApplications(applications);

        const franchiseResults = await Promise.all(
          applications.map((app) =>
            franchiseHandler.getFranchise(app.franchiseId)
          )
        );

        setApplicationDetails(
          applications
            .map((app, idx) => {
              const franchise = franchiseResults[idx];
              if (franchise) {
                return { application: app, franchise };
              }
              return null;
            })
            .filter((detail): detail is ApplicationDetails => detail !== null)
        );
      } catch (error: any) {
        setFranchises([]);
      }
    };

    fetchAll();
  }, [actor, principal]);

  // Mock data - replace with actual API calls
  const dashboardData = {
    totalFranchises: 24,
    activeFranchisees: 22,
    pendingApplications: 8,
    averageRating: 4.7,
  };

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
      case "Pending Payment":
        return "bg-yellow-100 text-yellow-700";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="">
      {!franchises ? (
        <div className="">Loading</div>
      ) : (
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

              <Tabs defaultValue="franchises" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="franchises">My Franchises</TabsTrigger>
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                  <TabsTrigger value="chat">Messages</TabsTrigger>
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
                        {franchises.length > 0 &&
                          franchises.map((franchise) => (
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
                                  <Badge
                                    className={getStatusColor(franchise.status)}
                                  >
                                    {franchise.status}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                  <img
                                    src={
                                      franchise.coverImageUrl ||
                                      "https://picsum.photos/seed/" +
                                        franchise.id +
                                        "/300/200"
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
                                      $
                                      {franchise.startingPrice.toLocaleString()}
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

                <ApplicationsTab
                  applicationDetails={applicationDetails}
                  getStatusColor={getStatusColor}
                />
                <TabsContent value="chat" className="space-y-6">
                  <ChatSystem userType="franchisor" />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <AddFranchiseModal
            isOpen={isAddBusinessModalOpen}
            onClose={() => setIsAddBusinessModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
