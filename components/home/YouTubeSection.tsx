"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, BookOpen } from "lucide-react";

function YoutubeSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  )
}
import { Button } from "@/components/ui/button";

export interface YouTubeTopic {
  _key?: string;
  title?: string;
  description?: string;
}

export interface YouTubeSectionData {
  sectionLabel?: string;
  heading?: string;
  subtext?: string;
  featuredVideoId?: string;
  channelUrl?: string;
  playlistNote?: string;
  ctaButton?: { text?: string; url?: string };
  topics?: YouTubeTopic[];
}

interface Props {
  data?: YouTubeSectionData;
}

const DEFAULTS: Required<YouTubeSectionData> = {
  sectionLabel: "FREE ON YOUTUBE",
  heading: "Watch the Full SFM Series — Free",
  subtext: "CA Nikesh Shah's complete CA Final Strategic Financial Management lecture series. Available free on YouTube. New lectures every week.",
  featuredVideoId: "dQw4w9WgXcQ",
  channelUrl: "https://www.youtube.com/@CANikeshShah",
  playlistNote: "New lectures added every week",
  ctaButton: { text: "View Full Playlist on YouTube →", url: "https://www.youtube.com/@CANikeshShah" },
  topics: [
    { title: "Portfolio Theory & CAPM", description: "Risk, return, efficient frontier, and CAPM explained from first principles." },
    { title: "Derivatives — Options & Futures", description: "Options pricing, futures hedging, and real market examples." },
    { title: "Mergers & Acquisitions", description: "Valuation methods, deal structures, and exam-focused practice." },
    { title: "International Finance", description: "Exchange rates, hedging strategies, and international parity conditions." },
  ],
};

export default function YouTubeSection({ data = {} }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const d = { ...DEFAULTS, ...data };
  const topics = (d.topics && d.topics.length > 0) ? d.topics : DEFAULTS.topics;

  return (
    <section className="py-20 md:py-28 bg-offwhite" ref={ref} id="youtube">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-red-500 font-semibold text-sm uppercase tracking-widest mb-3">
            {d.sectionLabel}
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
            {d.heading}
          </h2>
          <p className="text-muted max-w-2xl mx-auto">{d.subtext}</p>
        </motion.div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Left — YouTube embed */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${d.featuredVideoId}?rel=0&modestbranding=1`}
                  title="CA Final SFM Lecture"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <p className="text-muted text-sm text-center mt-3">
              ▶ {d.playlistNote}
            </p>
          </motion.div>

          {/* Right — Topic cards */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {topics.map((topic, i) => (
              <motion.a
                key={topic._key ?? topic.title}
                href={d.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-md transition-all duration-200 group"
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.25 + i * 0.08, duration: 0.4 }}
              >
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                  <BookOpen className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-navy text-sm mb-1">{topic.title}</h4>
                  <p className="text-muted text-xs leading-relaxed">{topic.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted flex-shrink-0 group-hover:text-red-500 transition-colors mt-0.5" />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <a href={d.ctaButton?.url ?? d.channelUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="default" className="gap-2">
              <YoutubeSvg className="w-5 h-5" />
              {d.ctaButton?.text ?? DEFAULTS.ctaButton!.text}
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
