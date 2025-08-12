import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, UserCheck, Building2 } from "lucide-react";
import Link from "next/link";

export function GetStartedCTA() {
  return (
    <section className="py-20 from-green-600 to-green-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Join the future of franchising today. Whether you're looking to
            invest or expand, MitraChain has the tools you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-colors">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-white mb-4">
                For Franchisees
              </h3>
              <p className="text-green-100 mb-6 leading-relaxed">
                Discover verified franchise opportunities with transparent
                financials and blockchain-secured licenses.
              </p>
              <Button
                asChild
                className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-3"
              >
                <a href="/franchises">
                  Browse Franchises
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-colors">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-white mb-4">
                For Franchisors
              </h3>
              <p className="text-green-100 mb-6 leading-relaxed">
                Expand your brand with qualified investors through our
                transparent, blockchain-powered marketplace.
              </p>
              <Button
                asChild
                className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-3"
              >
                <a href="/register">
                  List Your Franchise
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-green-100 mb-4">
            Have questions? We're here to help.
          </p>
          <Button
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 bg-transparent"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
}
