import { draftMode } from "next/headers";
import { client, draftClient } from "@/lib/sanity/client";
import { SITE_CONTENT_QUERY } from "@/lib/sanity/queries";
import type { SiteContent } from "@/lib/sanity/types";
import SectionErrorBoundary from "@/components/shared/SectionErrorBoundary";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import AboutSection from "@/components/home/AboutSection";
import YouTubeSection from "@/components/home/YouTubeSection";
import VideoGrid from "@/components/home/VideoGrid";
import TeachingPhilosophy from "@/components/home/TeachingPhilosophy";
import AboutSeries from "@/components/home/AboutSeries";
import WhyUs from "@/components/home/WhyUs";
import Testimonials from "@/components/home/Testimonials";
import FAQSection from "@/components/home/FAQSection";
import YouTubeSubscribeBanner from "@/components/home/YouTubeSubscribeBanner";

export const revalidate = 60;

export default async function HomePage() {
  const { isEnabled: isDraft } = await draftMode()
  let content: SiteContent = {};
  try {
    const sanityClient = isDraft ? draftClient : client
    content = (await sanityClient.fetch<SiteContent>(SITE_CONTENT_QUERY)) ?? {};
  } catch {
    // Sanity unavailable — all sections fall back to hardcoded defaults
  }

  return (
    <>
      <SectionErrorBoundary sectionName="Hero">
        <HeroSection data={content.hero} />
      </SectionErrorBoundary>
      <SectionErrorBoundary sectionName="Stats">
        <StatsBar data={content.stats} />
      </SectionErrorBoundary>
      <SectionErrorBoundary sectionName="About">
        <AboutSection data={content.about} />
      </SectionErrorBoundary>
      <SectionErrorBoundary sectionName="YouTube">
        <YouTubeSection data={content.youtubeSection} />
      </SectionErrorBoundary>
      <SectionErrorBoundary sectionName="VideoGrid">
        <VideoGrid data={content.videoGrid} />
      </SectionErrorBoundary>
      <SectionErrorBoundary sectionName="TeachingPhilosophy">
        <TeachingPhilosophy data={content.teachingPhilosophy} />
      </SectionErrorBoundary>
      <SectionErrorBoundary sectionName="AboutSeries">
        <AboutSeries data={content.aboutSeries} />
      </SectionErrorBoundary>
      <SectionErrorBoundary sectionName="WhyUs">
        <WhyUs data={content.whoIsItFor} />
      </SectionErrorBoundary>
      <SectionErrorBoundary sectionName="Testimonials">
        <Testimonials data={content.testimonials} />
      </SectionErrorBoundary>
      <SectionErrorBoundary sectionName="FAQ">
        <FAQSection data={content.faq} />
      </SectionErrorBoundary>
      <SectionErrorBoundary sectionName="SubscribeBanner">
        <YouTubeSubscribeBanner data={content.youtubeSubscribeBanner} />
      </SectionErrorBoundary>
    </>
  );
}
