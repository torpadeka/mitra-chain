"use client";

import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

interface Industry {
  id: string;
  label: string;
  count: number;
}

interface Location {
  id: string;
  label: string;
  count: number;
}

interface FranchiseFiltersProps {
  investmentRange: number[];
  setInvestmentRange: (value: number[]) => void;
  selectedIndustries: string[];
  setSelectedIndustries: (value: string[]) => void;
  selectedLocations: string[];
  setSelectedLocations: (value: string[]) => void;
  expandedSections: {
    investment: boolean;
    industry: boolean;
    location: boolean;
    features: boolean;
  };
  setExpandedSections: (value: {
    investment: boolean;
    industry: boolean;
    location: boolean;
    features: boolean;
  }) => void;
  industries: Industry[];
  locations: Location[];
}

export function FranchiseFilters({
  investmentRange,
  setInvestmentRange,
  selectedIndustries,
  setSelectedIndustries,
  selectedLocations,
  setSelectedLocations,
  expandedSections,
  setExpandedSections,
  industries,
  locations,
}: FranchiseFiltersProps) {
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const handleIndustryChange = (industryId: string, checked: boolean) => {
    if (checked) {
      setSelectedIndustries([...selectedIndustries, industryId]);
    } else {
      setSelectedIndustries(
        selectedIndustries.filter((id) => id !== industryId)
      );
    }
  };

  const handleLocationChange = (locationId: string, checked: boolean) => {
    if (checked) {
      setSelectedLocations([...selectedLocations, locationId]);
    } else {
      setSelectedLocations(selectedLocations.filter((id) => id !== locationId));
    }
  };

  const clearAllFilters = () => {
    setInvestmentRange([50000, 500000]);
    setSelectedIndustries([]);
    setSelectedLocations([]);
  };

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {(selectedIndustries.length > 0 || selectedLocations.length > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Active Filters
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {selectedIndustries.map((industryId) => {
                const industry = industries.find((i) => i.id === industryId);
                return (
                  <span
                    key={industryId}
                    className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                  >
                    {industry?.label}
                    <button
                      onClick={() => handleIndustryChange(industryId, false)}
                      className="ml-1 hover:text-green-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
              {selectedLocations.map((locationId) => {
                const location = locations.find((l) => l.id === locationId);
                return (
                  <span
                    key={locationId}
                    className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                  >
                    {location?.label}
                    <button
                      onClick={() => handleLocationChange(locationId, false)}
                      className="ml-1 hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Investment Range */}
      <Card>
        <CardHeader className="pb-3">
          <button
            onClick={() => toggleSection("investment")}
            className="flex items-center justify-between w-full text-left"
          >
            <CardTitle className="text-sm font-medium">
              Investment Range
            </CardTitle>
            {expandedSections.investment ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </CardHeader>
        {expandedSections.investment && (
          <CardContent className="pt-0">
            <div className="space-y-4">
              <Slider
                value={investmentRange}
                onValueChange={setInvestmentRange}
                max={1000000}
                min={10000}
                step={10000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${investmentRange[0].toLocaleString()}</span>
                <span>${investmentRange[1].toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Industry */}
      <Card>
        <CardHeader className="pb-3">
          <button
            onClick={() => toggleSection("industry")}
            className="flex items-center justify-between w-full text-left"
          >
            <CardTitle className="text-sm font-medium">Industry</CardTitle>
            {expandedSections.industry ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </CardHeader>
        {expandedSections.industry && (
          <CardContent className="pt-0">
            <div className="space-y-3">
              {industries.map((industry) => (
                <div
                  key={industry.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={industry.id}
                      checked={selectedIndustries.includes(industry.id)}
                      onCheckedChange={(checked) =>
                        handleIndustryChange(industry.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={industry.id}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {industry.label}
                    </label>
                  </div>
                  <span className="text-xs text-gray-500">
                    ({industry.count})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Location */}
      <Card>
        <CardHeader className="pb-3">
          <button
            onClick={() => toggleSection("location")}
            className="flex items-center justify-between w-full text-left"
          >
            <CardTitle className="text-sm font-medium">Location</CardTitle>
            {expandedSections.location ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </CardHeader>
        {expandedSections.location && (
          <CardContent className="pt-0">
            <div className="space-y-3">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={location.id}
                      checked={selectedLocations.includes(location.id)}
                      onCheckedChange={(checked) =>
                        handleLocationChange(location.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={location.id}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {location.label}
                    </label>
                  </div>
                  <span className="text-xs text-gray-500">
                    ({location.count})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Features */}
      <Card>
        <CardHeader className="pb-3">
          <button
            onClick={() => toggleSection("features")}
            className="flex items-center justify-between w-full text-left"
          >
            <CardTitle className="text-sm font-medium">Features</CardTitle>
            {expandedSections.features ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </CardHeader>
        {expandedSections.features && (
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="verified" />
                <label
                  htmlFor="verified"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Verified Franchisors
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="financing" />
                <label
                  htmlFor="financing"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Financing Available
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="training" />
                <label
                  htmlFor="training"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Training Provided
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="support" />
                <label
                  htmlFor="support"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Ongoing Support
                </label>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
