import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  FileText,
  MessageSquare,
  CreditCard,
  Award,
  Users,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover",
    description:
      "Browse verified franchise opportunities with transparent financial data and reviews.",
    details:
      "Use our advanced filters to find franchises that match your investment level, industry preference, and location requirements.",
  },
  {
    icon: FileText,
    title: "Research",
    description:
      "Access detailed franchise information, financial projections, and franchisor support details.",
    details:
      "Review comprehensive franchise disclosure documents, training programs, and ongoing support offerings.",
  },
  {
    icon: MessageSquare,
    title: "Connect",
    description:
      "Communicate directly with franchisors through our secure messaging system.",
    details:
      "Ask questions, schedule calls, and get personalized information about franchise opportunities.",
  },
  {
    icon: CreditCard,
    title: "Apply",
    description:
      "Submit your application with financial qualifications and business plan.",
    details:
      "Complete the standardized application process with document verification and background checks.",
  },
  {
    icon: Award,
    title: "Get Licensed",
    description:
      "Receive your NFT-based franchise license upon approval and payment.",
    details:
      "Your franchise license is minted as an ICRC-7 NFT, providing verifiable proof of ownership on the blockchain.",
  },
  {
    icon: Users,
    title: "Launch",
    description:
      "Start your franchise with ongoing support and community backing.",
    details:
      "Access training resources, marketing materials, and connect with other franchisees in the network.",
  },
];

export function ProcessSteps() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4">
            Simple 6-Step Process
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From discovery to launch, our streamlined process makes franchising
            accessible and transparent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card
                key={index}
                className="relative group hover:shadow-lg transition-shadow border-gray-200"
              >
                <CardContent className="p-8">
                  <div className="absolute -top-4 left-8">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <IconComponent className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.details}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
