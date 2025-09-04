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
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import { useUser } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import NoPP from '../assets/no_pp.webp'

export default function ProfilePage() {
  //   const { user } = useAuth();
  // const user = {
  //   id: "1",
  //   firstName: "John",
  //   lastName: "Doe",
  //   email: "example@gmail.com",
  //   userType: "franchisee", // or "franchisor",
  // };
  const { user } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  // Mock user data - replace with actual API calls
  const userProfile = {
    firstName: user?.name || "John",
    email: user?.email || "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Ave, Seattle, WA 98101",
    userType: typeof user?.role === "string" ? user.role : "franchisee",
    joinDate: "January 15, 2024",
    profilePicture: user?.profilePicUrl,
    bio: user?.bio,
    linkedIn: "linkedin.com/in/johndoe",
    twitter: "@johndoe",
  };

  const accountStats = {
    franchisee: {
      ownedFranchises: 3,
      totalInvestment: "$425,000",
      averageRating: 4.8,
      yearsActive: 1,
    },
    franchisor: {
      totalFranchises: 24,
      activeFranchisees: 22,
      averageRating: 4.7,
      yearsActive: 5,
    },
  };

  const recentActivity = [
    {
      date: "2024-01-20",
      activity: "Updated franchise listing",
      type: "update",
    },
    {
      date: "2024-01-18",
      activity: "Received new application",
      type: "application",
    },
    {
      date: "2024-01-15",
      activity: "Completed training module",
      type: "training",
    },
    {
      date: "2024-01-12",
      activity: "Profile information updated",
      type: "profile",
    },
  ];

  const stats = accountStats[userProfile.userType as keyof typeof accountStats];

  return (
    <div>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  My Profile
                </h1>
                <p className="text-muted-foreground">
                  Manage your account information and preferences
                </p>
              </div>
              {/* <Button
                onClick={() => setIsEditModalOpen(true)}
                className="bg-brand-600 hover:bg-brand-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button> */}
            </div>
          </div>

          <div className="flex gap-8 ">
            {/* Profile Card */}
            <div className="min-w-80">
              <Card>
                <CardContent className="px-6 pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-100">
                      <img
                        src={
                          userProfile.profilePicture || NoPP
                        }
                        alt={`${userProfile.firstName} `}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">
                      {userProfile.firstName}
                    </h2>
                    <Badge
                      variant="secondary"
                      className={
                        userProfile.userType === "franchisor"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {userProfile.userType === "franchisor"
                        ? "Franchisor"
                        : "Franchisee"}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                      {userProfile.bio}
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{userProfile.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{userProfile.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{userProfile.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Joined {userProfile.joinDate}</span>
                    </div>
                  </div>
                  <div className="mt-10">
                    <Button
                      onClick={() =>
                        navigate("/dashboard/" + userProfile.userType)
                      }
                      className="!bg-brand-500 hover:!bg-brand-400 w-full hover:cursor-pointer"
                      variant="default"
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
            </div>

            <div className="w-full">
              <Card className="mb-2">
                <CardHeader>
                  <CardTitle className="text-lg">Account Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userProfile.userType === "franchisee" ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Owned Franchises
                        </span>
                        <span className="font-semibold">{2}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Total Investment
                        </span>
                        <span className="font-semibold">{1}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Average Rating
                        </span>
                        <span className="font-semibold">
                          {stats?.averageRating}/5
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Years Active
                        </span>
                        <span className="font-semibold">
                          {stats?.yearsActive} year
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Total Franchises
                        </span>
                        <span className="font-semibold">{1}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Active Franchisees
                        </span>
                        <span className="font-semibold">{2}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Average Rating
                        </span>
                        <span className="font-semibold">
                          {stats?.averageRating}/5
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Years Active
                        </span>
                        <span className="font-semibold">
                          {stats?.yearsActive} years
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>
                    Connect your social media profiles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">LinkedIn</p>
                        <p className="text-xs text-muted-foreground">
                          linkedin.com/in/{userProfile.firstName.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    {/* <Button variant="outline" size="sm">
                      Edit
                    </Button> */}
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Twitter</p>
                        <p className="text-xs text-muted-foreground">
                          @{userProfile.firstName.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    {/* <Button variant="outline" size="sm">
                      Edit
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* <div className="lg:col-span-2">
              <Tabs defaultValue="activity" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                  <TabsTrigger value="settings">Account Settings</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="activity" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription>
                        Your recent actions and updates
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30"
                          >
                            <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {activity.activity}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {activity.date}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {activity.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Social Links</CardTitle>
                      <CardDescription>
                        Connect your social media profiles
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">LinkedIn</p>
                            <p className="text-xs text-muted-foreground">
                              {userProfile.linkedIn}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Twitter</p>
                            <p className="text-xs text-muted-foreground">
                              {userProfile.twitter}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>

                      {userProfile.website && (
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Website</p>
                              <p className="text-xs text-muted-foreground">
                                {userProfile.website}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Account Settings
                      </CardTitle>
                      <CardDescription>
                        Manage your account preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bell className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">
                              Receive updates about your account
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Payment Methods</p>
                            <p className="text-sm text-muted-foreground">
                              Manage your payment information
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Document Storage</p>
                            <p className="text-sm text-muted-foreground">
                              Access your franchise documents
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Privacy Settings</p>
                            <p className="text-sm text-muted-foreground">
                              Control your profile visibility
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security Settings
                      </CardTitle>
                      <CardDescription>
                        Keep your account secure
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Password</p>
                          <p className="text-sm text-muted-foreground">
                            Last updated 30 days ago
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Change Password
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">
                            Two-Factor Authentication
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Enable
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Login Sessions</p>
                          <p className="text-sm text-muted-foreground">
                            Manage your active sessions
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Sessions
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Account Deletion</p>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account
                          </p>
                        </div>
                        <Button variant="destructive" size="sm">
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div> */}
          </div>
        </div>
      </div>

      {/* <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userProfile={userProfile}
      /> */}
    </div>
  );
}
