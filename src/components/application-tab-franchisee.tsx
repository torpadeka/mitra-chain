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
  Wallet,
} from "lucide-react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ChatHandler } from "@/handler/ChatHandler";
import { Principal } from "@dfinity/principal";
import { useNavigate } from "react-router";

// Type guard for Plug wallet
declare global {
  interface Window {
    ic?: {
      plug?: {
        isConnected: () => Promise<boolean>;
        requestConnect: (params?: {
          whitelist?: string[];
          host?: string;
          timeout?: number;
        }) => Promise<any>;
        requestTransfer: (params: {
          to: string;
          amount: number;
          memo?: string;
        }) => Promise<{ height: number }>;
        onExternalDisconnect: (callback: () => void) => void;
      };
    };
  }
}

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
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPlugConnected, setIsPlugConnected] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();

  console.log("Application Details:", applicationDetails.length);

  // Fetch applications for the logged-in franchisee
  useEffect(() => {
    if (!actor || !principal) {
      setError("You must be logged in to view applications.");
      return;
    }
  }, [actor, principal]);

  // Check Plug wallet connection
  useEffect(() => {
    const checkPlugConnection = async () => {
      if (typeof window !== "undefined" && window.ic?.plug) {
        try {
          const connected = await window.ic.plug!.isConnected();
          setIsPlugConnected(connected);
        } catch (err) {
          console.error("Error checking Plug connection:", err);
        }
      }
    };

    checkPlugConnection();

    // Listen for Plug wallet events
    if (typeof window !== "undefined" && window.ic?.plug) {
      window.ic.plug!.onExternalDisconnect(() => {
        setIsPlugConnected(false);
      });
    }
  }, []);

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

  const handleConnectPlug = async () => {
    if (typeof window === "undefined" || !window.ic?.plug) {
      setError(
        "Plug wallet extension not found. Please install Plug wallet first."
      );
      return;
    }

    try {
      const backendCanister = import.meta.env.VITE_CANISTER_ID_BACKEND || import.meta.env.CANISTER_ID_BACKEND;
      const icrcCanister = import.meta.env.VITE_CANISTER_ID_ICRC || import.meta.env.CANISTER_ID_ICRC;

      const whitelist = [backendCanister, icrcCanister].filter(Boolean);

      if (whitelist.length === 0) {
        throw new Error("No canister IDs configured. Please check your environment variables.");
      }

      await window.ic.plug!.requestConnect({
        whitelist,
        host: "https://icp0.io",
        timeout: 50000,
      });

      setIsPlugConnected(true);
      setError(null);
    } catch (err: any) {
      console.error("Error connecting to Plug:", err);

      let errorMessage = "Failed to connect to Plug wallet. Please try again.";

      if (err?.message?.includes("User rejected the request")) {
        errorMessage = "Connection request was rejected by user.";
      } else if (err?.message?.includes("Plug wallet extension not found")) {
        errorMessage = "Plug wallet extension not found. Please install Plug wallet first.";
      }

      setError(errorMessage);
    }
  };

  const handlePaymentModalOpen = (
    applicationId: number,
    franchise: FrontendFranchise
  ) => {
    setSelectedApplication(
      applicationDetails.find((d) => d.application.id === applicationId)
        ?.application || null
    );
    setSelectedFranchise(franchise);
    setPaymentAmount(franchise.startingPrice.toString());
    setIsPaymentModalOpen(true);
  };

  const handlePayment = async () => {
    if (!isPlugConnected) {
      setError("Please connect your Plug wallet first.");
      return;
    }

    if (!selectedApplication || !selectedFranchise) {
      setError("Invalid application selected.");
      return;
    }

    setPaymentLoading(true);
    setError(null);

    try {
      const amountInE8s = Math.floor(parseFloat(paymentAmount) * 100000000);
      const recipientPrincipal = import.meta.env.VITE_PAYMENT_RECIPIENT_PRINCIPAL ||
                               import.meta.env.VITE_CANISTER_ID_BACKEND ||
                               import.meta.env.CANISTER_ID_BACKEND ||
                               "uxrrr-q7777-77774-qaaaq-cai";

      const isLocalDevelopment = import.meta.env.DFX_NETWORK === 'local' ||
                                import.meta.env.VITE_DFX_NETWORK === 'local' ||
                                window.location.hostname === 'localhost' ||
                                window.location.hostname === '127.0.0.1';

      let result;

      if (isLocalDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 2000));

        result = {
          height: Math.floor(Math.random() * 1000000),
          network: "local",
          simulated: true,
          message: "Payment successful"
        };
      } else {
        if (!window.ic?.plug) {
          throw new Error("Plug wallet not connected. Please connect your wallet first.");
        }

        result = await window.ic.plug!.requestTransfer({
          to: recipientPrincipal,
          amount: amountInE8s,
          memo: selectedApplication.id.toString(),
        });
      }

      // Update application status after successful payment
      if (actor && selectedApplication) {
        const applicationHandler = new ApplicationHandler(actor);
        await applicationHandler.payApplication(selectedApplication.id);

        alert("Payment successful! Franchise added to your portfolio.");
        setIsPaymentModalOpen(false);
        navigate("/dashboard/franchisee");
      }
    } catch (err: any) {
      console.error("Payment error:", err);

      let errorMessage = "Failed to process payment. Please try again later.";

      if (err?.message?.includes("User rejected the request")) {
        errorMessage = "Transaction cancelled by user.";
      } else if (err?.message?.includes("Insufficient balance")) {
        errorMessage = "Insufficient ICP balance to complete this transaction.";
      } else if (err?.message?.includes("Invalid principal")) {
        errorMessage = "Invalid recipient address. Please contact support.";
      } else if (err?.code === 3000) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      }

      setError(errorMessage);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleContact = async (franchise: FrontendFranchise | null) => {
    if (!actor || !principal || !franchise) return;
    const chatHandler = new ChatHandler(actor);
    try {
      const conversations =
        await chatHandler.getAllConversationsByPrincipal(principal);

      let existingConversation = conversations.find((c: any) => {
        return c.participants.some((p: string) => p === franchise.owner);
      });

      let conversationId: number;

      if (existingConversation) {
        conversationId = Number(existingConversation.conversationId);
      } else {
        conversationId = Number(
          await actor.createConversation([
            principal,
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

                {/* Payment Modal */}
                <Dialog
                  open={isPaymentModalOpen}
                  onOpenChange={setIsPaymentModalOpen}
                >
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Wallet className="w-5 h-5" />
                        Payment with Plug Wallet
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {!isPlugConnected ? (
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Connect your Plug wallet to make payments
                          </p>
                          <Button
                            onClick={handleConnectPlug}
                            className="w-full"
                            disabled={paymentLoading}
                          >
                            <Wallet className="w-4 h-4 mr-2" />
                            Connect Plug Wallet
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-green-600">
                            <Wallet className="w-4 h-4" />
                            <span className="text-sm">
                              Plug wallet connected
                            </span>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Franchise:
                            </p>
                            <p className="font-medium">
                              {selectedFranchise?.name}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Payment Amount (ICP):
                            </p>
                            <input
                              type="number"
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                              className="w-full p-2 border rounded-md"
                              min="0"
                              step="0.00000001"
                            />
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <Button
                              variant="outline"
                              onClick={() => setIsPaymentModalOpen(false)}
                              disabled={paymentLoading}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handlePayment}
                              disabled={
                                paymentLoading ||
                                !paymentAmount ||
                                parseFloat(paymentAmount) <= 0
                              }
                            >
                              {paymentLoading
                                ? "Processing..."
                                : `Pay ${paymentAmount} ICP`}
                            </Button>
                          </div>
                        </div>
                      )}
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
                {detail.application.status === "PendingPayment" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:cursor-pointer"
                    onClick={() =>
                      handlePaymentModalOpen(
                        detail.application.id,
                        detail.franchise
                      )
                    }
                  >
                    <Coins className="w-4 h-4 mr-1" />
                    Pay
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
