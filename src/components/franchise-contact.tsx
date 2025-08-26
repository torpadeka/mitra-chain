"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Shield } from "lucide-react";
import { toast } from "sonner";

interface FranchiseContactProps {
  franchise: Franchise;
}

export function FranchiseContact({ franchise }: FranchiseContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    investment: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast("Success", {
      description: `Successfully requested information for ${franchise.name}.`,
    });
  };

  return (
    <div className="space-y-6 sticky top-8">
      {/* Quick Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Franchisor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <Input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
              autoComplete="off"
            />
            <Input
              placeholder="Available Investment"
              value={formData.investment}
              onChange={(e) =>
                setFormData({ ...formData, investment: e.target.value })
              }
            />
            <Textarea
              placeholder="Tell us about your interest in this franchise..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={4}
            />
            <Button className="w-full btn-primary">Request Information</Button>
          </form>
        </CardContent>
      </Card>

      {/* Investment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Investment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Starting Price</span>
              <span className="font-semibold">
                ${franchise.startingPrice.toLocaleString()}
              </span>
            </div>
            {franchise.royaltyFee && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Franchise Fee</span>
                <span className="font-semibold">
                  ${franchise.royaltyFee.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Get in Touch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">
                {franchise.contactNumber || "1-800-FRANCHISE"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">
                {franchise.contactEmail || "info@example.com"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">
                {franchise.locations?.join(", ") || "Available Nationwide"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">Mon-Fri 9AM-6PM EST</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      {franchise.isVerified && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <Shield className="w-8 h-8 text-green-600 mx-auto" />
              <div className="text-sm text-gray-600">
                <div className="font-semibold text-gray-900">
                  Verified Franchisor
                </div>
                <div>Background checked & verified</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
