import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Users, Award, Briefcase } from "lucide-react"

interface FranchiseDetailsProps {
  franchise: {
    longDescription: string
    features: string[]
    financials: {
      franchiseFee: number
      totalInvestment: { min: number; max: number }
      liquidCapital: number
      netWorth: number
      royaltyFee: string
      marketingFee: string
    }
    support: {
      training: string
      marketing: string
      operations: string
      technology: string
    }
    requirements: {
      experience: string
      space: string
      employees: string
      territory: string
    }
  }
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
          <p className="text-gray-700 leading-relaxed mb-6">{franchise.longDescription}</p>
          <div className="flex flex-wrap gap-2">
            {franchise.features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {feature}
              </Badge>
            ))}
          </div>
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
                <span className="font-semibold">${franchise.financials.franchiseFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Investment</span>
                <span className="font-semibold">
                  ${franchise.financials.totalInvestment.min.toLocaleString()} - $
                  {franchise.financials.totalInvestment.max.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Liquid Capital Required</span>
                <span className="font-semibold">${franchise.financials.liquidCapital.toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Net Worth Required</span>
                <span className="font-semibold">${franchise.financials.netWorth.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Royalty Fee</span>
                <span className="font-semibold">{franchise.financials.royaltyFee}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Marketing Fee</span>
                <span className="font-semibold">{franchise.financials.marketingFee}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support & Training */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-green-600" />
            Support & Training
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Training</h4>
                <p className="text-gray-600">{franchise.support.training}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Marketing</h4>
                <p className="text-gray-600">{franchise.support.marketing}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Operations</h4>
                <p className="text-gray-600">{franchise.support.operations}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Technology</h4>
                <p className="text-gray-600">{franchise.support.technology}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Experience Required</span>
                <span className="font-semibold">{franchise.requirements.experience}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Space Requirements</span>
                <span className="font-semibold">{franchise.requirements.space}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Employees</span>
                <span className="font-semibold">{franchise.requirements.employees}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Territory</span>
                <span className="font-semibold">{franchise.requirements.territory}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
