import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Rocket, Award } from "lucide-react";

const milestones = [
  {
    year: "2023",
    title: "The Idea",
    description:
      "Founded by blockchain and franchise industry veterans who saw the need for transparency and efficiency.",
    icon: Rocket,
  },
  {
    year: "2024",
    title: "Platform Development",
    description:
      "Built the core platform on Internet Computer Protocol with NFT-based licensing system.",
    icon: Users,
  },
  {
    year: "2024",
    title: "Beta Launch",
    description:
      "Launched beta version with 50+ verified franchisors and 1,000+ registered users.",
    icon: Award,
  },
  {
    year: "2025",
    title: "DAO Governance",
    description:
      "Transitioning to community governance with SNS DAO and token distribution.",
    icon: Calendar,
  },
];

export function OurStory() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4">
            Our Story
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From a simple idea to revolutionizing an entire industry, here's how
            MitraChain came to life.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {milestones.map((milestone, index) => {
              const IconComponent = milestone.icon;
              return (
                <Card
                  key={index}
                  className="border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {milestone.year}
                          </span>
                          <h3 className="font-bold text-xl text-gray-900">
                            {milestone.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto border-green-200 bg-green-50">
            <CardContent className="p-8">
              <h3 className="font-bold text-2xl text-gray-900 mb-4">
                The Problem We Solved
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Traditional franchising was plagued by high broker fees, lack of
                transparency, and lengthy processes. Franchisees couldn't verify
                claims, and franchisors struggled to find qualified candidates.
                We built MitraChain to solve these problems with blockchain
                technology, creating a trustless, transparent, and efficient
                marketplace.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
