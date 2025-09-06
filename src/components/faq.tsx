"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question:
      "What makes MitraChain different from traditional franchise platforms?",
    answer:
      "MitraChain uses blockchain technology to provide complete transparency, NFT-based franchise licenses for verifiable ownership, and community governance through DAO voting. This eliminates intermediaries, reduces costs, and ensures all transactions are publicly auditable.",
  },
  {
    question: "How do NFT franchise licenses work?",
    answer:
      "When you successfully acquire a franchise, you receive an ICRC-7 compliant NFT in your wallet. This NFT serves as immutable proof of your franchise ownership, can be verified instantly by anyone, and contains all relevant license information on the blockchain.",
  },
  {
    question: "What is the Internet Computer Protocol (ICP)?",
    answer:
      "ICP is a blockchain that runs at web speed with low costs and environmental sustainability. Unlike other blockchains, ICP can host entire applications, making it perfect for MitraChain's comprehensive franchise marketplace.",
  },
  {
    question: "How does DAO governance work?",
    answer:
      "Token holders can create and vote on proposals that affect the platform, such as fee structures, new features, and policy changes. This ensures the community has a direct say in how MitraChain evolves and operates.",
  },
  {
    question: "Are there any fees for using MitraChain?",
    answer:
      "MitraChain charges minimal platform fees for successful franchise transactions. These fees are significantly lower than traditional franchise brokers because we eliminate intermediaries through blockchain automation.",
  },
  {
    question: "How secure is my information on MitraChain?",
    answer:
      "All sensitive data is encrypted and stored securely. Public information like franchise listings and reviews are on the blockchain for transparency, while private communications and personal data are protected with enterprise-grade security.",
  },
  {
    question: "Can I transfer my franchise license to someone else?",
    answer:
      "Yes, NFT-based licenses can be transferred according to the franchise agreement terms. The blockchain ensures the transfer is recorded immutably and the new owner receives verifiable proof of ownership.",
  },
  {
    question: "Do I need cryptocurrency experience to use MitraChain?",
    answer:
      "No! We've designed MitraChain to be user-friendly for everyone. Our wallet integration is simple, and we provide step-by-step guidance for all blockchain interactions. You can focus on finding the right franchise opportunity.",
  },
];

export function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-background to-background py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-sans font-bold text-3xl md:text-4xl text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-neutral-700">
            Get answers to common questions about MitraChain and
            blockchain-powered franchising.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="border-neutral-200 hover:bg-secondary hover:shadow-lg shadow-neutral-200"
            >
              <CardContent className="p-0">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full text-left p-6 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold font-jetbrains-mono text-lg text-primary pr-4">
                      {faq.question}
                    </h3>
                    {openItems.includes(index) ? (
                      <ChevronUp className="w-5 h-5 text-neutral-700 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-700 flex-shrink-0" />
                    )}
                  </div>
                </button>
                {openItems.includes(index) && (
                  <div className="px-6 pb-6">
                    <p className="text-neutral-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
