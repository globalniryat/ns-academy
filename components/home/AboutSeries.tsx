"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export interface AboutSeriesData {
  heading?: string;
  subtext?: string;
  topics?: string[];
}

interface Props {
  data?: AboutSeriesData;
}

const DEFAULTS: Required<AboutSeriesData> = {
  heading: "What's Covered in the Series",
  subtext: "This is the complete CA Final SFM syllabus as per ICAI. Every topic. Every concept. Taught through logic.",
  topics: [
    "Portfolio Theory",
    "CAPM",
    "Options",
    "Futures",
    "Forex",
    "Mergers & Acquisitions",
    "Valuation",
    "Revision Strategy",
  ],
};

export default function AboutSeries({ data = {} }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const heading = data.heading ?? DEFAULTS.heading;
  const subtext = data.subtext ?? DEFAULTS.subtext;
  const topics = (data.topics && data.topics.length > 0) ? data.topics : DEFAULTS.topics;

  return (
    <section className="py-16 md:py-20 bg-white" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
        <motion.h2
          className="font-heading text-2xl md:text-3xl font-bold text-navy mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {heading}
        </motion.h2>

        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {topics.map((topic, i) => (
            <motion.span
              key={topic}
              className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 text-green-800 text-sm font-semibold rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.15 + i * 0.05, duration: 0.3 }}
            >
              {topic}
            </motion.span>
          ))}
        </motion.div>

        <motion.p
          className="text-muted text-base max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {subtext}
        </motion.p>
      </div>
    </section>
  );
}
