import Hero from "@/components/landing/Hero";
import UMRMapSection from "@/components/landing/UMRMapSection";
import EvidenceSection from "@/components/landing/EvidenceSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import SdgSection from "@/components/landing/SdgSection";
import LandingGate from "@/components/landing/LandingGate";

export default function Home() {
  return (
    <div className="landing-surface">
      <Hero />
      <UMRMapSection />
      <EvidenceSection />
      <FeaturesSection />
      <SdgSection />
      <LandingGate />
    </div>
  );
}
