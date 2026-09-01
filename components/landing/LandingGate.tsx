"use client";

import { useSession } from "next-auth/react";
import WhySection from "@/components/landing/WhySection";
import FlowSection from "@/components/landing/FlowSection";
import TestimoniSection from "@/components/landing/TestimoniSection";
import TechSection from "@/components/landing/TechSection";
import AuthLockBanner from "@/components/landing/AuthLockBanner";

export default function LandingGate() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session?.user;

  if (!isLoggedIn) {
    return <AuthLockBanner />;
  }

  return (
    <>
      <WhySection />
      <FlowSection />
      <TestimoniSection />
      <TechSection />
    </>
  );
}
