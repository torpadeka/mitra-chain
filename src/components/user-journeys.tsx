"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, UserCheck, ArrowRight } from "lucide-react";

const journeys = {
  franchisee: {
    title: "For Franchisees",
    subtitle: "Entrepreneurs & Investors",
    icon: UserCheck,
    color: "green",
    steps: [
      {
        title: "Create Profile",
        description:
          "Connect your wallet and complete your investor profile with financial qualifications.",
        duration: "5 minutes",
      },
      {
        title: "Browse & Filter",
        description:
          "Explore franchise opportunities using our advanced search and filtering system.",
        duration: "30 minutes",
      },
      {
        title: "Research & Compare",
        description:
          "Review detailed franchise information, financial data, and franchisee testimonials.",
        duration: "2-3 hours",
      },
      {
        title: "Connect with Franchisors",
        description:
          "Use our secure messaging system to ask questions and schedule consultations.",
        duration: "1-2 weeks",
      },
      {
        title: "Submit Application",
        description:
          "Complete the application process with required documents and financial verification.",
        duration: "1 week",
      },
      {
        title: "Receive NFT License",
        description:
          "Upon approval, receive your franchise license as a verifiable NFT in your wallet.",
        duration: "Instant",
      },
    ],
  },
  franchisor: {
    title: "For Franchisors",
    subtitle: "Business Owners & Brands",
    icon: Building2,
    color: "blue",
    steps: [
      {
        title: "Register Brand",
        description:
          "Create your franchisor profile and verify your business credentials on the platform.",
        duration: "1 day",
      },
      {
        title: "Create Listing",
        description:
          "Build comprehensive franchise listings with financial data, support details, and requirements.",
        duration: "2-3 days",
      },
      {
        title: "Set Parameters",
        description:
          "Define investment ranges, territory requirements, and franchisee qualifications.",
        duration: "1 day",
      },
      {
        title: "Review Applications",
        description:
          "Evaluate franchisee applications through our streamlined review system.",
        duration: "Ongoing",
      },
      {
        title: "Conduct Interviews",
        description:
          "Connect with qualified candidates through our secure communication platform.",
        duration: "2-4 weeks",
      },
      {
        title: "Issue NFT Licenses",
        description:
          "Mint franchise licenses as NFTs for approved franchisees, creating verifiable ownership.",
        duration: "Instant",
      },
    ],
  },
};

export function UserJourneys() {
  const [activeJourney, setActiveJourney] = useState<
    "franchisee" | "franchisor"
  >("franchisee");

  const currentJourney = journeys[activeJourney];
  const IconComponent = currentJourney.icon;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4">
            Tailored for Your Role
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you're looking to invest in a franchise or expand your
            brand, we've designed specific journeys for your needs.
          </p>
        </div>

        {/* Journey Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
            <Button
              variant={activeJourney === "franchisee" ? "default" : "ghost"}
              onClick={() => setActiveJourney("franchisee")}
              className={`px-6 py-3 ${activeJourney === "franchisee" ? "btn-primary" : ""}`}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              For Franchisees
            </Button>
            <Button
              variant={activeJourney === "franchisor" ? "default" : "ghost"}
              onClick={() => setActiveJourney("franchisor")}
              className={`px-6 py-3 ${activeJourney === "franchisor" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
            >
              <Building2 className="w-4 h-4 mr-2" />
              For Franchisors
            </Button>
          </div>
        </div>

        {/* Journey Content */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center pb-8">
            <div
              className={`w-16 h-16 ${currentJourney.color === "green" ? "bg-green-100" : "bg-blue-100"} rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              <IconComponent
                className={`w-8 h-8 ${currentJourney.color === "green" ? "text-green-600" : "text-blue-600"}`}
              />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {currentJourney.title}
            </CardTitle>
            <p className="text-gray-600">{currentJourney.subtitle}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {currentJourney.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 ${currentJourney.color === "green" ? "bg-green-600" : "bg-blue-600"} text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {step.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {step.duration}
                      </Badge>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {index < currentJourney.steps.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-gray-300 mt-2" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
