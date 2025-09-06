import { Button } from "@/components/ui/button";
import { ArrowDown, Shield, Users, Zap } from "lucide-react";

export function HowItWorksHero() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-background to-secondary py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-sans font-bold text-4xl md:text-6xl text-primary mb-6">
            How MitraChain
            <span className="text-brand-600 block font-jetbrains-mono">
              Works
            </span>
          </h1>
          <p className="text-xl text-neutral-700 mb-8 leading-relaxed">
            Discover how our blockchain-powered platform revolutionizes
            franchising with transparency, security, and community governance.
            From discovery to ownership, every step is verified and secure.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-800" />
              </div>
              <h3 className="font-jetbrains-mono font-semibold text-xl text-primary mb-2">
                Blockchain Secured
              </h3>
              <p className="text-neutral-700">
                All transactions and licenses verified on-chain
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-800" />
              </div>
              <h3 className="font-jetbrains-mono font-semibold text-xl text-primary mb-2">
                Community Owned
              </h3>
              <p className="text-neutral-700">
                DAO governance by token holders
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-800" />
              </div>
              <h3 className="font-jetbrains-mono font-semibold text-xl text-primary mb-2">
                Instant Verification
              </h3>
              <p className="text-neutral-700">
                Real-time franchise license validation
              </p>
            </div>
          </div>

          <Button variant={"primary"} size={"lg"}>
            Get Started Today
          </Button>

          <div className="flex justify-center pt-24">
            <ArrowDown className="w-6 h-6 text-neutral-700 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
