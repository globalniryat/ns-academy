"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";

export interface TestimonialData {
  id: string;
  name: string;
  college: string | null;
  role: string | null;
  quote: string;
  rating: number;
  avatarUrl: string | null;
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

const AVATAR_COLORS = ["#16a34a","#15803d","#166534","#d97706","#059669","#0f766e"];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

interface Props {
  testimonials?: TestimonialData[];
}

export default function Testimonials({ testimonials = [] }: Props) {
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

          <div className="mt-8 inline-flex items-center gap-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4">
            <div>
              <p className="text-4xl font-bold text-white">4.9</p>
              <StarRating count={5} />
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-left">
              <p className="text-white font-semibold">Overall Rating</p>
              <p className="text-white/50 text-sm">Based on verified reviews</p>
            </div>
          </div>
        </motion.div>

        {/* Testimonials grid */}
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => {
              const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
              return (
                <motion.div
                  key={t.id}
                  className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
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
                      style={{ background: color }}
                    >
                      {t.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.avatarUrl} alt={t.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        getInitials(t.name)
                      )}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t.name}</p>
                      <p className="text-white/50 text-xs">
                        {[t.role, t.college].filter(Boolean).join(" · ")}
                      </p>
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
          All reviews are from verified enrolled students. Names shared with permission.
        </motion.p>
      </div>
    </section>
  );
}
