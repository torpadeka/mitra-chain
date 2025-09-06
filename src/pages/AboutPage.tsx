import { AboutHero } from "@/components/about-hero";
import { MissionVision } from "@/components/mission-vision";
import { OurStory } from "@/components/our-story";
import { TeamSection } from "@/components/team-section";
import { Values } from "@/components/values";
import { Roadmap } from "@/components/roadmap";
import { JoinUs } from "@/components/join-us";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AboutHero />
      <MissionVision />
      <OurStory />
      <TeamSection />
      {/* <Values /> */}
      <Roadmap />
      {/* <JoinUs /> */}
      <Footer />
    </div>
  );
}
