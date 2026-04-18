import React from "react";
import { STATIC_TESTIMONIALS, STATIC_FAQS } from "@/lib/static-data";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import InstructorProfile from "@/components/home/InstructorProfile";
import FeaturedCourse from "@/components/home/FeaturedCourse";
import WhyUs from "@/components/home/WhyUs";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";
import FAQSection from "@/components/home/FAQSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <InstructorProfile />
      <FeaturedCourse />
      <WhyUs />
      <Testimonials testimonials={STATIC_TESTIMONIALS} />
      <FAQSection faqs={STATIC_FAQS} />
      <CTABanner />
    </>
  );
}
