import React from "react";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import InstructorProfile from "@/components/home/InstructorProfile";
import FeaturedCourse from "@/components/home/FeaturedCourse";
import WhyUs from "@/components/home/WhyUs";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";
import FAQSection from "@/components/home/FAQSection";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const [testimonials, faqs] = await Promise.all([
    prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <>
      <HeroSection />
      <StatsBar />
      <InstructorProfile />
      <FeaturedCourse />
      <WhyUs />
      <Testimonials testimonials={testimonials} />
      <FAQSection faqs={faqs} />
      <CTABanner />
    </>
  );
}
