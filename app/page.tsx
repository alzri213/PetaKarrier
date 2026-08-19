import Hero from "@/components/landing/Hero";
import FeaturesSection from "@/components/landing/FeaturesSection";
import StatsSection from "@/components/landing/StatsSection";
import SdgSection from "@/components/landing/SdgSection";
import WhySection from "@/components/landing/WhySection";
import ServicesSection from "@/components/landing/ServicesSection";
import FlowSection from "@/components/landing/FlowSection";
import TestimoniSection from "@/components/landing/TestimoniSection";
import TechSection from "@/components/landing/TechSection";
import { getPlatformStats } from "@/lib/actions/sdg-impact";

export default async function Home() {
  const stats = await getPlatformStats();

  return (
    <>
      <Hero stats={stats} />
      <StatsSection stats={stats} />
      <FeaturesSection />
      <ServicesSection />
      <SdgSection />
      <WhySection />
      <FlowSection />
      <TestimoniSection />
      <TechSection />
    </>
  );
}
