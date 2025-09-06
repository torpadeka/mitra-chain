import { HowItWorksHero } from "@/components/how-it-works-hero";
import { ProcessSteps } from "@/components/process-steps";
import { UserJourneys } from "@/components/user-journeys";
import { BlockchainFeatures } from "@/components/blockchain-features";
import { FAQ } from "@/components/faq";
import { GetStartedCTA } from "@/components/get-started-cta";
import { Footer } from "@/components/footer";

export default function HowItWorksPage() {
  return (
    <div className="">
      <HowItWorksHero />
      <ProcessSteps />
      <UserJourneys />
      <BlockchainFeatures />
      <FAQ />
      {/* <GetStartedCTA /> */}
      <Footer />
    </div>
  );
}
