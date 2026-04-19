"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Mail, CheckCircle } from "lucide-react";

function YoutubeSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  )
}
import { Button } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity/image";

export interface HeroData {
  badgeText?: string;
  headline?: string;
  subtext?: string;
  bulletPoints?: string[];
  primaryButton?: { text?: string; url?: string };
  secondaryButton?: { text?: string; url?: string };
  profileImage?: { asset: { _ref: string } };
  youtubeVideoId?: string;
  youtubeNote?: string;
}

interface Props {
  data?: HeroData;
}

const DEFAULTS: HeroData = {
  badgeText: "Taught by CA Nikesh Shah · CA Final Expert",
  headline: "Understand CA Final SFM — Not Just Memorize It",
  subtext: "CA Nikesh Shah's logic-first approach to Strategic Financial Management — built for students with zero prior knowledge. Walk into the exam room confident.",
  bulletPoints: [
    "Logic-first teaching — understand, don't memorize",
    "Zero prior knowledge required to start",
    "Full CA Final SFM syllabus covered",
    "Free on YouTube — watch before you decide",
  ],
  primaryButton: { text: "Watch Free Lectures on YouTube →", url: "https://www.youtube.com/@CANikeshShah" },
  secondaryButton: { text: "Get in Touch", url: "/contact" },
  youtubeVideoId: "dQw4w9WgXcQ",
  youtubeNote: "New lectures added every week",
};

export default function HeroSection({ data = {} }: Props) {
  const d = { ...DEFAULTS, ...data };
  const bullets = (d.bulletPoints && d.bulletPoints.length > 0) ? d.bulletPoints : DEFAULTS.bulletPoints!;

  const profileImageUrl = data?.profileImage?.asset?._ref
    ? urlFor(data.profileImage).url()
    : "/nikesh-shah.png";
  // Sanity CDN already optimizes images — bypass Next.js image proxy to avoid SSRF blocks on NAT64 networks
  const isSanityImage = profileImageUrl.startsWith('https://cdn.sanity.io');

  return (
    <section className="relative min-h-screen bg-navy overflow-hidden flex items-end md:items-center pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="absolute inset-0 hero-grid-pattern" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left — Text */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            {/* Trust badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm px-4 py-2 rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <GraduationCap className="w-4 h-4 text-gold flex-shrink-0" />
              <span>{d.badgeText}</span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-5">
              {d.headline?.includes("SFM") ? (
                <>
                  {d.headline.split("SFM")[0]}
                  <span className="text-teal">SFM</span>
                  {d.headline.split("SFM")[1]}
                </>
              ) : (
                d.headline
              )}
            </h1>

            <p className="text-slate-200 text-lg md:text-xl leading-relaxed mb-6 max-w-lg mx-auto md:mx-0">
              {d.subtext}
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 max-w-lg mx-auto md:mx-0">
              {bullets.map((b) => (
                <div key={b} className="flex items-center gap-2 text-sm text-white/80">
                  <CheckCircle className="w-4 h-4 text-teal flex-shrink-0" />
                  {b}
                </div>
              ))}
            </div>

            {/* YouTube note */}
            <motion.div
              className="inline-flex items-center gap-2 bg-green-900/30 border border-green-400/20 text-green-300 text-xs font-semibold px-4 py-2 rounded-full mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <YoutubeSvg className="w-3.5 h-3.5" />
              Full series available free on YouTube · New lectures every week
            </motion.div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <div className="flex flex-col items-center sm:items-start gap-1">
                <a href={d.primaryButton?.url ?? DEFAULTS.primaryButton!.url} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="default" className="gap-2 w-full sm:w-auto" id="hero-youtube">
                    <YoutubeSvg className="w-5 h-5" />
                    {d.primaryButton?.text ?? DEFAULTS.primaryButton!.text}
                  </Button>
                </a>
                <span className="text-white/45 text-xs">Free · No signup · New lectures every week</span>
              </div>
              <Link href={d.secondaryButton?.url ?? DEFAULTS.secondaryButton!.url!}>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-white/30 text-white hover:bg-white/10 hover:border-white/60 w-full sm:w-auto"
                  id="hero-contact"
                >
                  <Mail className="w-5 h-5" />
                  {d.secondaryButton?.text ?? DEFAULTS.secondaryButton!.text}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right — Instructor photo + video */}
          <motion.div
            className="order-last md:order-none"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-blue/20 blur-2xl rounded-2xl pointer-events-none" />

              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#111827]">
                <div className="relative h-80 w-full">
                  <Image
                    src={profileImageUrl}
                    alt="CA Nikesh Shah — CA Final SFM Educator"
                    fill
                    unoptimized={isSanityImage}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top"
                    priority
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#111827] to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-bold text-lg font-display">CA Nikesh Shah</p>
                    <p className="text-white/70 text-sm">CA Final · SFM Expert · 10+ Years Teaching</p>
                  </div>
                </div>

                {/* YouTube embed */}
                <div className="border-t border-white/10">
                  <div className="p-2">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${d.youtubeVideoId ?? "dQw4w9WgXcQ"}?rel=0&modestbranding=1`}
                        title="CA Final SFM Free Lecture — Nikesh Shah"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    {d.youtubeNote && (
                      <p className="text-white/50 text-xs text-center mt-2 pb-1">▶ {d.youtubeNote}</p>
                    )}
                  </div>
                </div>

                <div className="absolute top-3 right-3 bg-teal text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
                  Free on YouTube
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-offwhite to-transparent pointer-events-none" />
    </section>
  );
}
