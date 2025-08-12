"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock, Shield } from "lucide-react"

interface FranchiseContactProps {
  franchise: {
    name: string
    investment: { min: number; max: number }
  }
}

export function FranchiseContact({ franchise }: FranchiseContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    investment: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  return (
    <div className="space-y-6 sticky top-8">
      {/* Quick Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Franchisor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                placeholder="Available Investment"
                value={formData.investment}
                onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
              />
            </div>
            <div>
              <Textarea
                placeholder="Tell us about your interest in this franchise..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
              />
            </div>
            <Button type="submit" className="w-full btn-primary">
              Request Information
            </Button>
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
              <span className="text-gray-600">Total Investment</span>
              <span className="font-semibold">
                ${franchise.investment.min.toLocaleString()} - ${franchise.investment.max.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Franchise Fee</span>
              <span className="font-semibold">$45,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Liquid Capital</span>
              <span className="font-semibold">$100,000</span>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <Button className="w-full btn-secondary">Download Brochure</Button>
            </div>
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
              <span className="text-gray-700">1-800-FRANCHISE</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">info@greenleafcafe.com</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">Available Nationwide</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">Mon-Fri 9AM-6PM EST</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <Shield className="w-8 h-8 text-green-600 mx-auto" />
            <div className="text-sm text-gray-600">
              <div className="font-semibold text-gray-900">Verified Franchisor</div>
              <div>Background checked & verified</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
