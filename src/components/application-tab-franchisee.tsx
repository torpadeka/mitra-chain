"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import {
  ApplicationHandler,
  FrontendApplication,
} from "@/handler/ApplicationHandler";
import { FrontendFranchise } from "@/handler/FranchiseHandler";
import {
  FileText,
  Notebook,
  MapPin,
  Calendar,
  Eye,
  DollarSign,
  MessageSquare,
  Coins,
} from "lucide-react";
import { TabsContent } from "./ui/tabs";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ChatHandler } from "@/handler/ChatHandler";
import { Principal } from "@dfinity/principal";
import { useNavigate } from "react-router";
import { stringToPrincipal } from "@/lib/utils";
// import PaymentModal from "./payment-modal";

interface ApplicationDetail {
  franchise: FrontendFranchise;
  application: FrontendApplication;
}

interface ApplicationsTabProps {
  applicationDetails: ApplicationDetail[];
  getStatusColor: (status: string) => string;
}

export function ApplicationsTab({
  getStatusColor,
  applicationDetails,
}: ApplicationsTabProps) {
  const { user, actor, principal } = useUser();
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<FrontendApplication | null>(null);
  const [selectedFranchise, setSelectedFranchise] =
    useState<FrontendFranchise | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  console.log("Application Details:", applicationDetails.length);

  // Fetch applications for the logged-in franchisee
  useEffect(() => {
    if (!actor || !principal) {
      setError("You must be logged in to view applications.");
      return;
    }
  }, [actor, principal]);

  const handleViewOpen = (
    application: FrontendApplication,
    franchise: FrontendFranchise
  ) => {
    if (!user) {
      setError("You must be logged in to view application details.");
      return;
    }
    setSelectedApplication(application);
    setSelectedFranchise(franchise);
    setIsViewOpen(true);
    setError(null);
  };

  // const handlePay = async (id: number) => {
  //   if (!user || !actor) return;
  //   const applicationHandler = new ApplicationHandler(actor);
  //   try {
  //     await applicationHandler.payApplication(id);
  //     alert("Payment successful!");
  //     navigate("/dashboard/franchisee");
  //   } catch (err) {
  //     console.error("Payment error:", err);
  //     setError("Failed to process payment. Please try again later.");
  //   }
  // };

  const handleContact = async (franchise: FrontendFranchise | null) => {
    if (!actor || !principal || !franchise) return;
    const chatHandler = new ChatHandler(actor);
    try {
      const conversations = await chatHandler.getAllConversationsByPrincipal(
        stringToPrincipal(principal)
      );

      let existingConversation = conversations.find((c: any) => {
        return c.participants.some((p: string) => p === franchise.owner);
      });

      let conversationId: number;

      if (existingConversation) {
        conversationId = Number(existingConversation.conversationId);
      } else {
        conversationId = Number(
          await actor.createConversation([
            stringToPrincipal(principal),
            Principal.fromText(franchise.owner),
          ])
        );
      }

      window.location.href = `/dashboard/franchisee/chat/${conversationId}`;
    } catch (err) {
      console.error("Error handling contact:", err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          My Applications
        </CardTitle>
        <CardDescription>
          View your submitted franchise applications and their details
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {applicationDetails.length == 0 && (
          <p className="text-sm text-muted-foreground">
            No applications found.
          </p>
        )}
        <div className="space-y-4">
          {applicationDetails.map((detail) => (
            <div
              key={detail.application.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">{detail.franchise.name}</h3>
                  <Badge className={getStatusColor(detail.application.status)}>
                    {detail.application.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="flex items-center gap-1">
                    <Notebook className="w-3 h-3" />
                    {detail.application.coverLetter.length > 25
                      ? `${detail.application.coverLetter.slice(0, 25)}...`
                      : detail.application.coverLetter}
                  </p>
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {detail.franchise.locations.join(", ")}
                  </p>
                  <p className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Starting Price: $
                    {detail.franchise.startingPrice.toLocaleString()}
                  </p>
                  <p className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Applied: {detail.application.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Dialog
                  open={
                    isViewOpen &&
                    selectedApplication?.id === detail.application.id
                  }
                  onOpenChange={setIsViewOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleViewOpen(detail.application, detail.franchise)
                      }
                      className="hover:cursor-pointer"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>
                        Application for {selectedFranchise?.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Franchise Description:
                        </p>
                        <p className="text-sm">
                          {selectedFranchise?.description}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Starting Price:
                        </p>
                        <p className="text-sm">
                          ${selectedFranchise?.startingPrice.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Locations:
                        </p>
                        <p className="text-sm">
                          {selectedFranchise?.locations.join(", ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Royalty Fee:
                        </p>
                        <p className="text-sm">
                          {selectedFranchise?.royaltyFee || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          License Duration:
                        </p>
                        <p className="text-sm">
                          {selectedFranchise?.licenseDuration.OneTime
                            ? "One-Time"
                            : `${selectedFranchise?.licenseDuration.Years || 0} Years`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Cover Letter:
                        </p>
                        <p className="text-sm">
                          {selectedApplication?.coverLetter}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Application Status:
                        </p>
                        <Badge
                          className={getStatusColor(
                            selectedApplication?.status || ""
                          )}
                        >
                          {selectedApplication?.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Applied On:
                        </p>
                        <p className="text-sm">
                          {selectedApplication?.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:cursor-pointer"
                  onClick={() => handleContact(detail.franchise)}
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Contact
                </Button>
                {/* {detail.application.status === "PendingPayment" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:cursor-pointer"
                    onClick={() => handlePay(detail.application.id)}
                  >
                    <Coins className="w-4 h-4 mr-1" />
                    Pay
                  </Button>
                  <PaymentModal
                    ownerPrincipal={detail.franchise.owner}
                    amount={detail.application.price}
                    id={detail.application.id}
                  />
                )} */}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
