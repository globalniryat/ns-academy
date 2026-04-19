"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";

export interface TestimonialItem {
  _key?: string;
  name?: string;
  college?: string;
  initials?: string;
  color?: string;
  quote?: string;
  // legacy fields kept for backwards compat
  id?: string;
  role?: string | null;
  rating?: number;
  avatarUrl?: string | null;
}

export interface TestimonialsData {
  sectionLabel?: string;
  heading?: string;
  subtext?: string;
  overallRating?: string;
  items?: TestimonialItem[];
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      ))}
    </div>
  );
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const FALLBACK_COLORS = ["bg-green-600", "bg-blue-600", "bg-amber-600", "bg-purple-600", "bg-teal-600", "bg-red-600"];

interface Props {
  data?: TestimonialsData;
  testimonials?: TestimonialItem[];
}

export default function Testimonials({ data, testimonials: legacyTestimonials }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const sectionLabel = data?.sectionLabel ?? "STUDENT STORIES";
  const heading = data?.heading ?? "Results That Speak for Themselves";
  const subtext = data?.subtext ?? "Students from Symbiosis College Pune and across India share their experience.";
  const overallRating = data?.overallRating ?? "4.9";
  const DEFAULT_ITEMS: TestimonialItem[] = [
    { name: "Priya Sharma", college: "CA Final · Delhi", initials: "PS", color: "bg-green-600", quote: "CA Nikesh Sir explains SFM like no one else. The CAPM module was crystal clear — I attempted every derivatives question in my exam. Something I never thought was possible for me." },
    { name: "Rahul Mehta", college: "Symbiosis College · Pune", initials: "RM", color: "bg-blue-600", quote: "Free on YouTube means I could watch, rewatch, and rewatch again without any pressure. Passed CA Final with SFM as my strongest subject. Genuinely life-changing, thank you sir." },
    { name: "Ananya Joshi", college: "CA Final · Mumbai", initials: "AJ", color: "bg-purple-600", quote: "I came from commerce with zero finance background. After the first 10 lectures, everything clicked. The logic-first approach is unlike any coaching I have tried before." },
    { name: "Karan Patel", college: "CA Final · Ahmedabad", initials: "KP", color: "bg-amber-600", quote: "The portfolio theory series changed how I think about finance. Sir connects every concept to the next — SFM stops feeling like disconnected chapters and becomes one clear story." },
    { name: "Sneha Iyer", college: "CA Final · Bangalore", initials: "SI", color: "bg-teal-600", quote: "M&A valuation used to terrify me. Three lectures in, I was solving problems independently. The clarity you get here is only possible when the teacher truly understands the subject." },
    { name: "Varun Gupta", college: "CA Final · Hyderabad", initials: "VG", color: "bg-red-600", quote: "The foreign exchange module alone is worth subscribing for. Real market examples, zero jargon, complete syllabus coverage — and it is all free. This is the only SFM resource you need." },
  ];

  const items: TestimonialItem[] = data?.items ?? legacyTestimonials ?? DEFAULT_ITEMS;

  return (
    <section className="py-20 md:py-28 bg-navy relative overflow-hidden" ref={ref} id="testimonials">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            {sectionLabel}
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            {heading}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">{subtext}</p>

          <div className="mt-8 inline-flex items-center gap-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4">
            <div>
              <p className="text-4xl font-bold text-white">{overallRating}</p>
              <StarRating count={5} />
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-left">
              <p className="text-white font-semibold">Overall Rating</p>
              <p className="text-white/50 text-sm">Based on verified reviews</p>
            </div>
          </div>
        </motion.div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((t, i) => {
              const initials = t.initials ?? getInitials(t.name ?? '');
              const colorClass = t.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length];
              const subtitle = t.college ?? (t.role ? [t.role, t.college].filter(Boolean).join(" · ") : "");
              return (
                <motion.div
                  key={t._key ?? t.id ?? t.name}
                  className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Quote className="w-7 h-7 text-gold/50 mb-3 flex-shrink-0" />
                  <p className="text-white/80 text-sm leading-relaxed mb-5 flex-1 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <StarRating count={t.rating ?? 5} />
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md ${colorClass}`}>
                      {initials}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t.name}</p>
                      {subtitle && <p className="text-white/50 text-xs">{subtitle}</p>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-white/40">No testimonials yet.</p>
        )}

        <motion.p
          className="text-center text-white/40 text-sm mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          All reviews are from verified students. Names shared with permission.
        </motion.p>
      </div>
    </section>
  );
}
