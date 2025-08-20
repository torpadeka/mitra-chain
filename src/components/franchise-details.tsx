import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Users,
  Award,
  Briefcase,
  AlignVerticalDistributeStartIcon,
  CalendarArrowDown,
} from "lucide-react";

interface FranchiseDetailsProps {
  franchise: Franchise;
}

export function FranchiseDetails({ franchise }: FranchiseDetailsProps) {
  return (
    <div className="space-y-8">
      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-green-600" />
            About This Franchise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            {franchise.description}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarArrowDown className="w-5 h-5 text-green-600" />
            License Duration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            {franchise.licenseDuration.Years} years
          </p>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Financial Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Franchise Fee</span>
                <span className="font-semibold">
                  ${franchise.royaltyFee?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Gross Profit</span>
                <span className="font-semibold">
                  ${franchise.minGrossProfit?.toLocaleString()} - $
                  {franchise.maxGrossProfit?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Net Profit</span>
                <span className="font-semibold">
                  ${franchise.minNetProfit?.toLocaleString()} - $
                  {franchise.maxNetProfit?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
