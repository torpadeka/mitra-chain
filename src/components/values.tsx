import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Lightbulb, Globe, Heart, Zap } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Transparency",
    description:
      "Every transaction, review, and piece of data is verifiable on the blockchain.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "Our platform is owned and governed by the community it serves.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We continuously push the boundaries of what's possible in franchising.",
  },
  {
    icon: Globe,
    title: "Accessibility",
    description:
      "Making franchise opportunities available to entrepreneurs worldwide.",
  },
  {
    icon: Heart,
    title: "Empowerment",
    description:
      "Giving both franchisors and franchisees the tools they need to succeed.",
  },
  {
    icon: Zap,
    title: "Efficiency",
    description:
      "Streamlining processes and reducing costs through automation.",
  },
];

export function Values() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4">
            Our Core Values
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These principles guide every decision we make and every feature we
            build.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <Card
                key={index}
                className="border-gray-200 hover:shadow-lg transition-shadow text-center"
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
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
