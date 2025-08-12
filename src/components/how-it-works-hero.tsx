import { Button } from "@/components/ui/button";
import { ArrowDown, Shield, Users, Zap } from "lucide-react";

export function HowItWorksHero() {
  return (
    <section className="from-green-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-serif font-bold text-4xl md:text-6xl text-gray-900 mb-6">
            How MitraChain
            <span className="text-green-600 block">Works</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Discover how our blockchain-powered platform revolutionizes
            franchising with transparency, security, and community governance.
            From discovery to ownership, every step is verified and secure.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-serif font-semibold text-lg text-gray-900 mb-2">
                Blockchain Secured
              </h3>
              <p className="text-gray-600">
                All transactions and licenses verified on-chain
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-serif font-semibold text-lg text-gray-900 mb-2">
                Community Owned
              </h3>
              <p className="text-gray-600">DAO governance by token holders</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-serif font-semibold text-lg text-gray-900 mb-2">
                Instant Verification
              </h3>
              <p className="text-gray-600">
                Real-time franchise license validation
              </p>
            </div>
          </div>

          <Button className="btn-primary text-lg px-8 py-4 mb-8">
            Get Started Today
          </Button>

          <div className="flex justify-center">
            <ArrowDown className="w-6 h-6 text-gray-400 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
