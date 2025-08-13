"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Plus } from "lucide-react"

interface AddBusinessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddBusinessModal({ isOpen, onClose }: AddBusinessModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedSupport, setSelectedSupport] = useState<string[]>([])

  const categories = [
    "Food & Beverage",
    "Retail",
    "Fitness & Health",
    "Education",
    "Technology",
    "Automotive",
    "Home Services",
    "Beauty & Wellness",
    "Entertainment",
    "Professional Services",
  ]

  const features = [
    "Proven Business Model",
    "Comprehensive Training",
    "Marketing Support",
    "Territory Protection",
    "Ongoing Support",
    "Brand Recognition",
    "Bulk Purchasing Power",
    "Technology Platform",
  ]

  const supportTypes = [
    "Initial Training",
    "Ongoing Training",
    "Marketing Materials",
    "Operations Manual",
    "Site Selection",
    "Grand Opening Support",
    "Quality Assurance",
    "Financial Guidance",
  ]

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) => (prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]))
  }

  const handleSupportToggle = (support: string) => {
    setSelectedSupport((prev) => (prev.includes(support) ? prev.filter((s) => s !== support) : [...prev, support]))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual business submission
    console.log("Business submitted")
    onClose()
    setCurrentStep(1)
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Add New Franchise Business
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Step {currentStep} of 4: Add your franchise opportunity to the marketplace
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input id="businessName" placeholder="Enter business name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Business Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your franchise opportunity..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" type="url" placeholder="https://example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone *</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" required />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Investment & Financial */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Investment & Financial Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minInvestment">Minimum Investment *</Label>
                  <Input id="minInvestment" type="number" placeholder="50000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxInvestment">Maximum Investment *</Label>
                  <Input id="maxInvestment" type="number" placeholder="100000" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="franchiseFee">Franchise Fee *</Label>
                  <Input id="franchiseFee" type="number" placeholder="45000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="royaltyFee">Royalty Fee (%) *</Label>
                  <Input id="royaltyFee" type="number" placeholder="6" min="0" max="100" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marketingFee">Marketing Fee (%)</Label>
                  <Input id="marketingFee" type="number" placeholder="2" min="0" max="100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="liquidCapital">Required Liquid Capital</Label>
                  <Input id="liquidCapital" type="number" placeholder="75000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="financingOptions">Financing Options</Label>
                <Textarea
                  id="financingOptions"
                  placeholder="Describe available financing options..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          )}

          {/* Step 3: Features & Support */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Features & Support</h3>

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Key Features</Label>
                  <p className="text-sm text-muted-foreground mb-3">Select the key features of your franchise</p>
                  <div className="grid grid-cols-2 gap-2">
                    {features.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature}
                          checked={selectedFeatures.includes(feature)}
                          onCheckedChange={() => handleFeatureToggle(feature)}
                        />
                        <Label htmlFor={feature} className="text-sm">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedFeatures.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1"
                          onClick={() => handleFeatureToggle(feature)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Support Provided</Label>
                  <p className="text-sm text-muted-foreground mb-3">Select the support you provide to franchisees</p>
                  <div className="grid grid-cols-2 gap-2">
                    {supportTypes.map((support) => (
                      <div key={support} className="flex items-center space-x-2">
                        <Checkbox
                          id={support}
                          checked={selectedSupport.includes(support)}
                          onCheckedChange={() => handleSupportToggle(support)}
                        />
                        <Label htmlFor={support} className="text-sm">
                          {support}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedSupport.map((support) => (
                      <Badge key={support} variant="secondary" className="text-xs">
                        {support}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1"
                          onClick={() => handleSupportToggle(support)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Media & Requirements */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Media & Requirements</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Business Images</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Drag and drop images here, or click to browse</p>
                    <Button variant="outline" size="sm">
                      Choose Files
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Franchisee Requirements</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Describe the ideal franchisee profile and requirements..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="territories">Available Territories</Label>
                    <Input id="territories" placeholder="e.g., California, Texas, Florida" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="units">Target Units</Label>
                    <Input id="units" type="number" placeholder="50" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              Previous
            </Button>
            <div className="flex gap-2">
              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Business
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
