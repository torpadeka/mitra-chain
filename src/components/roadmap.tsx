import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock } from "lucide-react";

const roadmapItems = [
  {
    quarter: "Q4 2024",
    title: "Platform Launch",
    status: "completed",
    items: [
      "Beta platform with 50+ franchisors",
      "NFT-based licensing system",
      "Secure messaging platform",
      "Advanced search and filtering",
    ],
  },
  {
    quarter: "Q1 2025",
    title: "Community Features",
    status: "in-progress",
    items: [
      "DAO governance implementation",
      "Token distribution mechanism",
      "Community voting system",
      "Enhanced user profiles",
    ],
  },
  {
    quarter: "Q2 2025",
    title: "Advanced Analytics",
    status: "planned",
    items: [
      "Franchise performance analytics",
      "Market trend insights",
      "ROI calculators",
      "Predictive modeling tools",
    ],
  },
  {
    quarter: "Q3 2025",
    title: "Global Expansion",
    status: "planned",
    items: [
      "Multi-language support",
      "Regional franchise categories",
      "Local payment methods",
      "Regulatory compliance tools",
    ],
  },
];

export function Roadmap() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4">
            Our Roadmap
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Here's what we've accomplished and what's coming next as we continue
            to innovate in the franchise space.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {roadmapItems.map((item, index) => (
            <Card
              key={index}
              className="border-gray-200 hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge
                    variant={
                      item.status === "completed" ? "default" : "secondary"
                    }
                    className={
                      item.status === "completed"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : item.status === "in-progress"
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                    }
                  >
                    {item.quarter}
                  </Badge>
                  {item.status === "completed" ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : item.status === "in-progress" ? (
                    <Clock className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-4">
                  {item.title}
                </h3>
                <ul className="space-y-2">
                  {item.items.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
