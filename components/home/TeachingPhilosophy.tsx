"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Lightbulb, Users, BookOpen } from "lucide-react";

export interface PhilosophyCard {
  _key?: string;
  icon?: string;
  title?: string;
  description?: string;
}

export interface TeachingPhilosophyData {
  sectionLabel?: string;
  heading?: string;
  cards?: PhilosophyCard[];
}

interface Props {
  data?: TeachingPhilosophyData;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Lightbulb, Users, BookOpen,
};
const ICON_STYLES = [
  { color: "text-gold", bg: "bg-gold/10" },
  { color: "text-teal", bg: "bg-teal/10" },
  { color: "text-blue", bg: "bg-blue/10" },
];

const DEFAULTS: Required<TeachingPhilosophyData> = {
  sectionLabel: "TEACHING PHILOSOPHY",
  heading: "Why Students Learn Better with Nikesh",
  cards: [
    { icon: "Lightbulb", title: "Logic-First Teaching", description: "Every concept is broken down into its simplest logical form — no rote memorization, ever. You understand the 'why' before the 'how'." },
    { icon: "Users", title: "Zero Prior Knowledge Required", description: "Whether you have a commerce background or are completely new to accounting, the series is designed to bring you up to speed from scratch." },
    { icon: "BookOpen", title: "Exam-Confident, Not Just Exam-Ready", description: "The goal isn't just to pass — it's for you to walk into the exam hall confident, knowing you truly understand the subject." },
  ],
};

export default function TeachingPhilosophy({ data = {} }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const d = { ...DEFAULTS, ...data };
  const cards = (d.cards && d.cards.length > 0) ? d.cards : DEFAULTS.cards;

  return (
    <section className="py-20 md:py-28 bg-offwhite" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-teal font-semibold text-sm uppercase tracking-widest mb-2">
            {d.sectionLabel}
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy">
            {d.heading}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => {
            const IconComponent = (card.icon && ICON_MAP[card.icon]) ? ICON_MAP[card.icon] : Lightbulb;
            const style = ICON_STYLES[i % ICON_STYLES.length];
            return (
              <motion.div
                key={card.title}
                className="flex flex-col gap-4 p-7 rounded-2xl border border-gray-100 hover:border-blue/20 hover:shadow-lg transition-all duration-300 group bg-white"
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.5 }}
              >
                <div className={`w-12 h-12 ${style.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                  <IconComponent className={`w-6 h-6 ${style.color}`} />
                </div>
                <div>
                  <h4 className="font-bold text-navy mb-2 text-base">{card.title}</h4>
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
