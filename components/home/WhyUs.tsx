"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Lightbulb, Heart, Clock, Calendar, Users, BookOpen } from "lucide-react";

function YoutubeSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  )
}

export interface WhoIsItForData {
  sectionLabel?: string;
  heading?: string;
  cards?: Array<{ _key?: string; title?: string; description?: string }>;
}

interface Props {
  data?: WhoIsItForData;
}

const ICON_POOL = [Lightbulb, YoutubeSvg, Heart, Calendar, Clock, Users, BookOpen];
const STYLE_POOL = [
  { color: "text-gold",     bg: "bg-gold/10" },
  { color: "text-red-500",  bg: "bg-red-50" },
  { color: "text-pink-500", bg: "bg-pink-50" },
  { color: "text-blue",     bg: "bg-blue/10" },
  { color: "text-teal",     bg: "bg-teal/10" },
  { color: "text-navy",     bg: "bg-navy/10" },
  { color: "text-purple-500", bg: "bg-purple-50" },
];

const DEFAULT_LABEL   = "Why Choose This Series";
const DEFAULT_HEADING = "Built Different for CA Final Students";
const DEFAULT_SUB     = "Everything designed around how real CA students need to understand, retain, and apply concepts under exam pressure.";

const DEFAULT_CARDS = [
  { title: "Logic-First Teaching",        description: "Every concept is explained from first principles. You'll understand why formulas exist — not just how to use them. Rote memorization is the enemy." },
  { title: "Free on YouTube",             description: "The complete CA Final SFM series is available free on YouTube. No signup, no payment. Just open and learn at your own pace." },
  { title: "Zero Prior Knowledge Needed", description: "The series is designed from the ground up to work even if you have never studied finance before. Everyone starts somewhere." },
  { title: "New Lectures Weekly",         description: "Consistent schedule. New concept lectures added every week so you always have fresh content to study alongside your exam prep." },
  { title: "Study at Your Own Pace",      description: "Rewatch any lecture as many times as you need. Pause, rewind, replay — YouTube works around your schedule." },
  { title: "Personal Support",            description: "CA Nikesh Shah personally responds to student queries. Use the WhatsApp button or contact page to reach out anytime." },
];

export default function WhyUs({ data }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const sectionLabel = data?.sectionLabel ?? DEFAULT_LABEL;
  const heading      = data?.heading      ?? DEFAULT_HEADING;
  const cards        = (data?.cards && data.cards.length > 0) ? data.cards : DEFAULT_CARDS;

  return (
    <section className="py-20 md:py-28 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-blue font-semibold text-sm uppercase tracking-widest mb-3">
            {sectionLabel}
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
            {heading}
          </h2>
          <p className="text-muted max-w-xl mx-auto">{DEFAULT_SUB}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => {
            const Icon  = ICON_POOL[i % ICON_POOL.length];
            const style = STYLE_POOL[i % STYLE_POOL.length];
            return (
              <motion.div
                key={('_key' in card ? card._key : undefined) ?? card.title ?? i}
                className="flex gap-5 p-6 rounded-2xl border border-gray-100 hover:border-blue/20 hover:shadow-md transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <div className={`w-12 h-12 ${style.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${style.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-2">{card.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{card.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
