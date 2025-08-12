import { Card, CardContent } from "@/components/ui/card";
import { Shield, Coins, Vote, Link, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "NFT-Based Licenses",
    description:
      "Franchise licenses are minted as ICRC-7 compliant NFTs, providing verifiable proof of ownership that can't be forged or duplicated.",
    benefits: [
      "Immutable ownership records",
      "Transferable assets",
      "Instant verification",
    ],
  },
  {
    icon: Coins,
    title: "Transparent Transactions",
    description:
      "All financial transactions are recorded on the Internet Computer blockchain, ensuring complete transparency and auditability.",
    benefits: [
      "Public transaction history",
      "Reduced fraud risk",
      "Automated compliance",
    ],
  },
  {
    icon: Vote,
    title: "DAO Governance",
    description:
      "Community members hold governance tokens and vote on platform improvements, fee structures, and new features.",
    benefits: [
      "Democratic decision making",
      "Community ownership",
      "Aligned incentives",
    ],
  },
  {
    icon: Link,
    title: "Smart Contracts",
    description:
      "Automated smart contracts handle license transfers, royalty payments, and compliance requirements without intermediaries.",
    benefits: ["Reduced costs", "Faster processing", "Eliminated middlemen"],
  },
  {
    icon: Zap,
    title: "Instant Settlement",
    description:
      "Blockchain technology enables instant settlement of transactions and immediate license transfers upon completion.",
    benefits: [
      "Real-time processing",
      "24/7 availability",
      "Global accessibility",
    ],
  },
  {
    icon: Globe,
    title: "Decentralized Network",
    description:
      "Built on Internet Computer Protocol, ensuring high performance, low costs, and environmental sustainability.",
    benefits: ["Carbon neutral", "Low transaction fees", "High throughput"],
  },
];

export function BlockchainFeatures() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4">
            Powered by Blockchain Technology
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            MitraChain leverages cutting-edge blockchain technology to create a
            transparent, secure, and efficient franchise marketplace that
            benefits everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-shadow border-gray-200 h-full"
              >
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                    <IconComponent className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed flex-1">
                    {feature.description}
                  </p>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div
                        key={benefitIndex}
                        className="flex items-center text-sm text-gray-700"
                      >
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-3" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
