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
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Notebook,
  MapPin,
  Calendar,
  Eye,
  MessageSquare,
} from "lucide-react";
import { useUser } from "@/context/AuthContext";
import { useState } from "react";
import { FranchiseHandler } from "@/handler/FranchiseHandler";
import { ApplicationHandler } from "@/handler/ApplicationHandler";
import { TabsContent } from "./ui/tabs";

interface FrontendFranchise {
  id: number;
  owner: string;
  name: string;
  categoryIds: number[];
  description: string;
  startingPrice: number;
  foundedIn: Date;
  totalOutlets: number;
  legalEntity: string;
  minGrossProfit?: number;
  maxGrossProfit?: number;
  minNetProfit?: number;
  maxNetProfit?: number;
  isDepositRequired: boolean;
  royaltyFee?: string;
  licenseDuration: { OneTime?: true; Years?: number };
  coverImageUrl: string;
  productGallery: string[];
  contactNumber?: string;
  contactEmail?: string;
  locations: string[];
  status: "Active" | "Inactive";
  isVerified: boolean;
  reviewsCount: number;
}

interface Application {
  id: number;
  status: string;
  coverLetter: string;
  createdAt: Date;
}

interface ApplicationDetail {
  franchise: FrontendFranchise;
  application: Application;
}

interface ApplicationsTabProps {
  applicationDetails: ApplicationDetail[];
  getStatusColor: (status: string) => string;
}

export function ApplicationsTab({
  applicationDetails,
  getStatusColor,
}: ApplicationsTabProps) {
  const { user, actor } = useUser();
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleReviewOpen = (
    application: Application,
    franchise: FrontendFranchise
  ) => {
    console.log("Opening review for application:", application);
    if (!user || !actor) {
      setError("You must be logged in to review applications.");
      return;
    }
    // if (
    //   String(user.role) !== "Franchisor" ||
    //   user.principal.toString() !== franchise.owner
    // ) {
    //   setError("Only the franchise owner can review applications.");
    //   return;
    // }
    setSelectedApplication(application);
    setIsReviewOpen(true);
    setRejectReason("");
    setError(null);
  };

  const handleApprove = async () => {
    if (!selectedApplication || !actor) return;
    try {
      const applicationHandler = new ApplicationHandler(actor);
      await applicationHandler.approveApplication(selectedApplication.id);
      setIsReviewOpen(false);
      setSelectedApplication(null);
      alert("Application approved successfully!");
    } catch (err: any) {
      setError("Failed to approve application: " + err.message);
    }
  };

  const handleReject = async () => {
    if (!selectedApplication || !actor || !rejectReason.trim()) return;
    try {
      const applicationHandler = new ApplicationHandler(actor);
      await applicationHandler.rejectApplication(
        selectedApplication.id,
        rejectReason
      );
      setIsReviewOpen(false);
      setSelectedApplication(null);
      setRejectReason("");
      alert("Application rejected successfully!");
    } catch (err: any) {
      setError("Failed to reject application: " + err.message);
    }
  };

  return (
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
            {applicationDetails.map((application) => (
              <div
                key={application.application.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">
                      {application.franchise.name}
                    </h3>
                    <Badge
                      className={getStatusColor(application.application.status)}
                    >
                      {application.application.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Notebook className="w-3 h-3" />
                      {application.application.coverLetter.length > 25
                        ? `${application.application.coverLetter.slice(0, 25)}...`
                        : application.application.coverLetter}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {application.franchise.locations.join(", ")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {application.application.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog
                    open={
                      isReviewOpen &&
                      selectedApplication?.id === application.application.id
                    }
                    onOpenChange={setIsReviewOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleReviewOpen(
                            application.application,
                            application.franchise
                          )
                        }
                        className="hover:cursor-pointer"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          Review Application for {application.franchise.name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Cover Letter:
                          </p>
                          <p className="text-sm">
                            {application.application.coverLetter}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Rejection Reason (if rejecting):
                          </p>
                          <Textarea
                            placeholder="Enter reason for rejection..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="min-h-[100px]"
                          />
                        </div>
                        {error && (
                          <p className="text-red-500 text-sm">{error}</p>
                        )}
                      </div>
                      <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={handleApprove}
                          disabled={!selectedApplication}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={handleReject}
                          disabled={
                            !selectedApplication || !rejectReason.trim()
                          }
                          variant="destructive"
                        >
                          Reject
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
  );
}
