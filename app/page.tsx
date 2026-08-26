import Hero from "@/components/landing/Hero";
import EvidenceSection from "@/components/landing/EvidenceSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import SdgSection from "@/components/landing/SdgSection";
import WhySection from "@/components/landing/WhySection";
import FlowSection from "@/components/landing/FlowSection";
import TestimoniSection from "@/components/landing/TestimoniSection";
import TechSection from "@/components/landing/TechSection";

export default function Home() {
  return (
    <div className="landing-surface">
      <Hero />
      <EvidenceSection />
      <FeaturesSection />
      <SdgSection />
      <WhySection />
      <FlowSection />
      <TestimoniSection />
      <TechSection />
    </div>
  );
}

