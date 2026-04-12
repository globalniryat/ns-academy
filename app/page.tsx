import React from "react";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import InstructorProfile from "@/components/home/InstructorProfile";
import FeaturedCourse from "@/components/home/FeaturedCourse";
import WhyUs from "@/components/home/WhyUs";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — CA Nikesh Shah + course intro + money-back trust */}
      <HeroSection />

      {/* 2. Quick stats bar — students, rating, content hours, guarantee */}
      <StatsBar />

      {/* 3. Instructor profile — Nikesh Shah bio, philosophy, credentials */}
      <InstructorProfile />

      {/* 4. Featured course section — single course value proposition */}
      <FeaturedCourse />

      {/* 5. Why choose this course — platform features + money-back banner */}
      <WhyUs />

      {/* 6. Testimonials — Symbiosis College Pune students & more */}
      <Testimonials />

      {/* 7. Final CTA */}
      <CTABanner />
    </>
  );
}
