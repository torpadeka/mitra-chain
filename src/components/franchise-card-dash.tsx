import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, DollarSign } from "lucide-react";

interface FranchiseCardProps {
  franchise: Franchise;
}

export function FranchiseCard({ franchise }: FranchiseCardProps) {
  return (
    <Card key={franchise.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{franchise.name}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Briefcase className="w-3 h-3" />
              {franchise.locations.join(", ")}
            </CardDescription>
          </div>
          <Badge
            variant={franchise.status === "Active" ? "default" : "secondary"}
            className={
              franchise.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }
          >
            {franchise.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={franchise.coverImageUrl || "/placeholder.svg"}
            alt={franchise.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Category:</span>
            <span className="font-medium">
              {franchise.categoryIds.length > 0
                ? `Category #${franchise.categoryIds[0]}`
                : "N/A"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Legal Entity:</span>
            <span className="font-mono text-xs">{franchise.legalEntity}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Est. Monthly Net Profit:
            </span>
            <span className="font-medium text-green-600">
              $
              {(franchise.minNetProfit ?? 0 / 12).toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}{" "}
              - $
              {(franchise.maxNetProfit ?? 0 / 12).toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Founded:</span>
            <span>{new Date(franchise.foundedIn).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <a
            href={`/dashboard/franchisee/franchise/${franchise.id}`}
            className="flex-1"
          >
            <Button variant="outline" className="w-full bg-transparent">
              <Briefcase className="w-4 h-4 mr-2" />
              Manage Details
            </Button>
          </a>
          <Button variant="outline" size="icon">
            <DollarSign className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
