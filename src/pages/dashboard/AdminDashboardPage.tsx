"use client";

import { useEffect, useState } from "react";
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
import { Users, FileText, CheckCircle } from "lucide-react";
import { useUser } from "@/context/AuthContext";
import { UserHandler, FrontendUser } from "@/handler/UserHandler";
import {
  ApplicationHandler,
  FrontendApplication,
} from "@/handler/ApplicationHandler";
import {
  TransactionHandler,
  FrontendTransaction,
} from "@/handler/TransactionHandler";
import { useNavigate } from "react-router";
import {
  FranchiseHandler,
  FrontendFranchise,
} from "@/handler/FranchiseHandler";

interface ApplicationDetails {
  application: FrontendApplication;
  franchise: FrontendFranchise;
}

export default function AdminDashboardPage() {
  const { actor, user, principal, loadFromSession } = useUser();
  const [users, setUsers] = useState<FrontendUser[]>([]);
  const [transactions, setTransactions] = useState<FrontendTransaction[]>([]);
  const [pendingNFTApplications, setPendingNFTApplications] = useState<
    ApplicationDetails[]
  >([]);
  const navigate = useNavigate();

  const session = loadFromSession();
  if (!session.user || session.user.role !== "Admin") {
    window.location.href = "/";
  }

  useEffect(() => {
    if (!actor || !principal) {
      setUsers([]);
      setTransactions([]);
      setPendingNFTApplications([]);
      return;
    }

    const fetchAll = async () => {
      try {
        // Fetch all users
        const userHandler = new UserHandler(actor);
        const userList = await userHandler.listUsers();
        setUsers(userList);

        // Fetch all transactions
        const transactionHandler = new TransactionHandler(actor);
        const transactionList = await transactionHandler.listTransactions();
        setTransactions(transactionList);

        // Fetch pending NFT applications and their associated franchises
        const applicationHandler = new ApplicationHandler(actor);
        const applications =
          await applicationHandler.listPendingNFTApplications();
        const franchiseHandler = new FranchiseHandler(actor);
        const franchiseResults = await Promise.all(
          applications.map((app) =>
            franchiseHandler.getFranchise(app.franchiseId)
          )
        );

        const applicationDetails = applications
          .map((app, idx) => {
            const franchise = franchiseResults[idx];
            if (franchise) {
              return { application: app, franchise };
            }
            return null;
          })
          .filter((detail): detail is ApplicationDetails => detail !== null);

        setPendingNFTApplications(applicationDetails);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setUsers([]);
        setTransactions([]);
        setPendingNFTApplications([]);
      }
    };

    fetchAll();
  }, [actor, principal]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-800";
      case "PendingPayment":
        return "bg-yellow-100 text-yellow-700";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "PendingNFT":
        return "bg-orange-100 text-orange-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCompleteApplication = async (applicationId: number) => {
    if (!actor) return;
    try {
      const applicationHandler = new ApplicationHandler(actor);
      await applicationHandler.completeApplication(applicationId);
      // BIKIN NFTTTTTTT
      setPendingNFTApplications((prev) =>
        prev.filter((detail) => detail.application.id !== applicationId)
      );
    } catch (error: any) {
      console.error("Error completing application:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage users, transactions, and pending NFT applications.
            </p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="pendingNFTs">
              Pending NFT Applications
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  All Users
                </CardTitle>
                <CardDescription>
                  View and manage all registered users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.length > 0 &&
                    users.map((user) => (
                      <Card
                        key={user.principal}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">
                                {user.name}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {user.email}
                              </CardDescription>
                            </div>
                            <Badge className={getStatusColor(user.role)}>
                              {user.role}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Role:
                              </span>
                              <span className="font-medium">{user.role}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Created At:
                              </span>
                              <span className="font-medium">
                                {user.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                            {user.address && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Address:
                                </span>
                                <span className="font-medium">
                                  {user.address}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  All Transactions
                </CardTitle>
                <CardDescription>
                  View all platform transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {transactions.length > 0 &&
                    transactions.map((transaction) => (
                      <Card
                        key={transaction.id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">
                                Transaction #{transaction.id}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {transaction.purpose}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                From:
                              </span>
                              <span className="font-medium">
                                {transaction.from}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">To:</span>
                              <span className="font-medium">
                                {transaction.to}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Amount:
                              </span>
                              <span className="font-medium">
                                {transaction.amount}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Timestamp:
                              </span>
                              <span className="font-medium">
                                {transaction.timestamp.toLocaleDateString()}
                              </span>
                            </div>
                            {transaction.relatedApplicationId && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Application ID:
                                </span>
                                <span className="font-medium">
                                  {transaction.relatedApplicationId}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending NFT Applications Tab */}
          <TabsContent value="pendingNFTs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Pending NFT Applications
                </CardTitle>
                <CardDescription>
                  Review and complete pending NFT applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingNFTApplications.length > 0 &&
                    pendingNFTApplications.map((detail) => (
                      <Card
                        key={detail.application.id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">
                                Application #{detail.application.id}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                Franchise: {detail.franchise.name}
                              </CardDescription>
                            </div>
                            <Badge
                              className={getStatusColor(
                                detail.application.status
                              )}
                            >
                              {detail.application.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Applicant:
                              </span>
                              <span className="font-medium">
                                {detail.application.applicantPrincipal}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Price:
                              </span>
                              <span className="font-medium">
                                {detail.application.price}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Created At:
                              </span>
                              <span className="font-medium">
                                {detail.application.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() =>
                              handleCompleteApplication(detail.application.id)
                            }
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Complete Application
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
