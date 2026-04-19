"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, ExternalLink } from "lucide-react";

export interface VideoItem {
  _key?: string;
  videoId?: string;
  title?: string;
  duration?: string;
}

export interface VideoGridData {
  heading?: string;
  videos?: VideoItem[];
}

interface Props {
  data?: VideoGridData;
}

const DEFAULTS: Required<VideoGridData> = {
  heading: "Latest Lectures",
  videos: [
    { videoId: "dQw4w9WgXcQ", title: "Introduction to SFM — What to Expect", duration: "45 min" },
    { videoId: "dQw4w9WgXcQ", title: "Portfolio Theory — Part 1", duration: "52 min" },
    { videoId: "dQw4w9WgXcQ", title: "CAPM Explained with Examples", duration: "38 min" },
    { videoId: "dQw4w9WgXcQ", title: "Options — Call & Put from Scratch", duration: "61 min" },
    { videoId: "dQw4w9WgXcQ", title: "Futures Hedging Strategy", duration: "44 min" },
    { videoId: "dQw4w9WgXcQ", title: "Forex & International Finance", duration: "55 min" },
  ],
};

export default function VideoGrid({ data = {} }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const heading = data.heading ?? DEFAULTS.heading;
  const videos = (data.videos && data.videos.length > 0) ? data.videos : DEFAULTS.videos;

  return (
    <section className="py-16 md:py-20 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.h3
          className="font-heading text-2xl md:text-3xl font-bold text-navy mb-8 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {heading}
        </motion.h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, i) => (
            <motion.a
              key={video._key ?? (video.videoId ?? '') + i}
              href={`https://www.youtube.com/watch?v=${video.videoId ?? ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl overflow-hidden border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.5 }}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {video.duration}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex items-start justify-between gap-2">
                <h4 className="font-semibold text-navy text-sm leading-snug group-hover:text-red-600 transition-colors">
                  {video.title}
                </h4>
                <ExternalLink className="w-4 h-4 text-muted flex-shrink-0 mt-0.5 group-hover:text-red-500 transition-colors" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
