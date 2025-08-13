"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Store,
  Award,
  BookOpen,
  FileText,
  MessageSquare,
  Phone,
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";
import { useParams } from "react-router";

export default function FranchiseeDetailPage() {
  const params = useParams();
  const franchiseId = params.id;

  // Mock data - replace with actual API calls based on franchiseId
  const franchiseData = {
    id: franchiseId,
    name: "Green Leaf Cafe",
    location: "Downtown Seattle, WA",
    licenseNumber: "GLC-2024-001",
    status: "Active",
    startDate: "January 15, 2024",
    trainingProgress: 85,
    category: "Food & Beverage",
    monthlyRevenue: "$45,000",
    territory: "Downtown Seattle, WA - 5 mile radius",
    image: "/cafe-franchise.png",
  };

  const recentActivities = [
    {
      date: "2024-01-20",
      activity: "Monthly report submitted",
      type: "report",
    },
    {
      date: "2024-01-18",
      activity: "Staff training completed",
      type: "training",
    },
    {
      date: "2024-01-15",
      activity: "License renewal processed",
      type: "license",
    },
    {
      date: "2024-01-12",
      activity: "New marketing materials received",
      type: "marketing",
    },
  ];

  const performanceMetrics = [
    { label: "Monthly Revenue", value: "$45,000", change: "+12%", trend: "up" },
    {
      label: "Customer Satisfaction",
      value: "4.8/5",
      change: "+0.2",
      trend: "up",
    },
    { label: "Staff Count", value: "12", change: "+2", trend: "up" },
    {
      label: "Operating Hours",
      value: "14hrs/day",
      change: "0",
      trend: "neutral",
    },
  ];

  return (
    <div>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <a
              href="/dashboard/franchisee"
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
                <p className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {franchiseData.location}
                </p>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800">
                {franchiseData.status}
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="license">License</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Franchise Image */}
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
                        {franchiseData.category}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Franchise Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Store className="h-5 w-5" />
                      Franchise Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Business Name:
                      </span>
                      <span className="text-sm">{franchiseData.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Location:</span>
                      <span className="text-sm">{franchiseData.location}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Start Date:</span>
                      <span className="text-sm">{franchiseData.startDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        License Number:
                      </span>
                      <span className="text-sm font-mono">
                        {franchiseData.licenseNumber}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Monthly Revenue:
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        {franchiseData.monthlyRevenue}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {activity.activity}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks for this franchise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      className="h-20 flex-col bg-transparent"
                    >
                      <Phone className="w-6 h-6 mb-2" />
                      <span className="text-sm">Contact Franchisor</span>
                    </Button>
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
                      <FileText className="w-6 h-6 mb-2" />
                      <span className="text-sm">Submit Report</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex-col bg-transparent"
                    >
                      <MessageSquare className="w-6 h-6 mb-2" />
                      <span className="text-sm">Get Support</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="license" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    License Information
                  </CardTitle>
                  <CardDescription>
                    Your franchise license details and status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">
                          License Number
                        </label>
                        <p className="text-lg font-mono">
                          {franchiseData.licenseNumber}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Issue Date
                        </label>
                        <p className="text-sm">{franchiseData.startDate}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Expiry Date
                        </label>
                        <p className="text-sm">January 15, 2029</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="default"
                            className="bg-green-100 text-green-800"
                          >
                            Active
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Territory</label>
                        <p className="text-sm">{franchiseData.territory}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Renewal Status
                        </label>
                        <p className="text-sm text-green-600">
                          Auto-renewal enabled
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button className="w-full md:w-auto">
                      <FileText className="w-4 h-4 mr-2" />
                      Download License Certificate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="training" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Training Progress
                  </CardTitle>
                  <CardDescription>
                    Complete your training modules to unlock new features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        Overall Progress
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {franchiseData.trainingProgress}%
                      </span>
                    </div>
                    <Progress
                      value={franchiseData.trainingProgress}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Operations Management</h4>
                        <p className="text-sm text-muted-foreground">
                          Learn daily operations and best practices
                        </p>
                      </div>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        Completed
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">
                          Customer Service Excellence
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Master customer interaction techniques
                        </p>
                      </div>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        Completed
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Financial Management</h4>
                        <p className="text-sm text-muted-foreground">
                          Understand accounting and reporting
                        </p>
                      </div>
                      <Badge variant="secondary">In Progress</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Marketing & Promotion</h4>
                        <p className="text-sm text-muted-foreground">
                          Local marketing strategies and campaigns
                        </p>
                      </div>
                      <Badge variant="outline">Not Started</Badge>
                    </div>
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
                            {metric.change !== "0" &&
                              (metric.trend === "up" ? "+" : "")}
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
                    Key metrics for your franchise performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-8 w-8 text-green-600" />
                        <div>
                          <h4 className="font-medium">Revenue Growth</h4>
                          <p className="text-sm text-muted-foreground">
                            12% increase from last month
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
                          <h4 className="font-medium">Customer Satisfaction</h4>
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
          </Tabs>
        </div>
      </div>
    </div>
  );
}
