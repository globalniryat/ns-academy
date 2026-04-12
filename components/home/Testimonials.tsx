"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Shreya Joshi",
    role: "CA Final Student, Symbiosis College Pune",
    quote:
      "I was genuinely scared of SFM — I thought it required some kind of innate math talent. CA Nikesh sir's approach completely flipped that belief. He explained every formula by showing me why it exists. By the third week, I was solving problems I'd never seen before. Cleared on my first attempt!",
    rating: 5,
    avatar: "SJ",
    color: "#2563EB",
    highlight: "First Attempt Clear",
  },
  {
    name: "Rohit Deshmukh",
    role: "CA Final, Pune (Re-attempter)",
    quote:
      "Honestly, I had failed SFM twice before — not because I didn't study, but because I was memorizing formulas without understanding them. Nikesh sir's logic-first videos made everything click. The derivatives module alone is worth the entire course fee. No questions asked refund policy gave me the confidence to try.",
    rating: 5,
    avatar: "RD",
    color: "#0D9488",
    highlight: "Cracked After 2 Failures",
  },
  {
    name: "Ananya Kulkarni",
    role: "CA Final Student, Symbiosis College Pune",
    quote:
      "I came in with absolutely zero finance background — just BCom basics. Within a month of the course, I was able to solve ICAI practice exam questions confidently. The way sir breaks down Portfolio Theory and CAPM is unlike anything I've seen in any textbook. 100% worth it.",
    rating: 5,
    avatar: "AK",
    color: "#7C3AED",
    highlight: "Zero Background → Confident",
  },
  {
    name: "Vikram Nair",
    role: "CA Final, Pune",
    quote:
      "I enrolled skeptically — I'd tried three other video courses before. Within the first two lectures I knew this was different. Sir doesn't just teach; he makes you think. The course structure is incredibly logical and the study notes are concise. Scored 58 in SFM, which was my best subject in Finals!",
    rating: 5,
    avatar: "VN",
    color: "#D4A843",
    highlight: "Scored 58 in Exams",
  },
  {
    name: "Priyanka Mehta",
    role: "CA Final Student, Symbiosis College Pune",
    quote:
      "The money-back guarantee sold me — I figured I had nothing to lose. But I never had to use it. The teaching style is so engaging that I actually looked forward to study sessions. Lifetime access means I can always go back and revise before exams.",
    rating: 5,
    avatar: "PM",
    color: "#059669",
    highlight: "Never Needed the Refund!",
  },
  {
    name: "Aditya Sharma",
    role: "CA Final, Mumbai",
    quote:
      "I was preparing for CA Finals while working full time. The self-paced nature of this course was a lifesaver. The explanation of Mergers & Acquisitions concepts was so crystal-clear that I could answer case study questions with confidence. CA Nikesh sir is a gem.",
    rating: 5,
    avatar: "AS",
    color: "#1A2744",
    highlight: "Cleared While Working",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="py-20 md:py-28 bg-navy relative overflow-hidden"
      ref={ref}
      id="testimonials"
    >
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/2 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            Student Stories
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Results That Speak for Themselves
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Students from Symbiosis College Pune and across India share their
            experience studying with CA Nikesh Shah
          </p>

          {/* Aggregate rating bar */}
          <div className="mt-8 inline-flex items-center gap-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4">
            <div>
              <p className="text-4xl font-bold text-white">4.9</p>
              <StarRating count={5} />
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-left">
              <p className="text-white font-semibold">Overall Rating</p>
              <p className="text-white/50 text-sm">Based on 200+ reviews</p>
            </div>
          </div>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              {/* Highlight tag */}
              <div className="mb-4">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full text-white/90"
                  style={{ background: `${t.color}40`, border: `1px solid ${t.color}60` }}
                >
                  ✓ {t.highlight}
                </span>
              </div>

              {/* Quote icon */}
              <Quote className="w-7 h-7 text-gold/50 mb-3 flex-shrink-0" />

              {/* Quote text */}
              <p className="text-white/80 text-sm leading-relaxed mb-5 flex-1 italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Stars */}
              <StarRating count={t.rating} />

              {/* Author */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md"
                  style={{ background: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/50 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom trust note */}
        <motion.p
          className="text-center text-white/40 text-sm mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          All reviews are from verified enrolled students. Names shared with permission.
        </motion.p>
      </div>
    </section>
  );
}
