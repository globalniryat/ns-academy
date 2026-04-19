"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { GraduationCap, Award, CheckCircle, ShieldCheck, Star } from "lucide-react";
import { urlFor } from "@/lib/sanity/image";

export interface AboutData {
  name?: string;
  title?: string;
  profileImage?: { asset: { _ref: string } };
  ratingBadge?: string;
  credentialBadge?: string;
  bio1?: string;
  bio2?: string;
  bio3?: string;
  pullQuote?: string;
  credentials?: Array<string | { _key?: string; text?: string }>;
  badges?: Array<string | { _key?: string; text?: string }>;
}

interface Props {
  data?: AboutData;
}

const DEFAULTS: AboutData = {
  name: "Nikesh Shah",
  title: "Chartered Accountant & CA Educator",
  ratingBadge: "4.9/5 Student Rating",
  credentialBadge: "CA (ICAI Qualified) · 10+ Years Teaching",
  bio1: "CA Nikesh Shah is a Chartered Accountant with a passion for making the toughest CA subjects approachable. After years of teaching at Symbiosis College, Pune, he identified one root cause of student failure: teaching through memorization instead of understanding.",
  bio2: "His series is built around a single principle — if a student truly understands the logic behind a concept, they can answer any exam question, even one they've never seen before. No formula-cramming. No shortcut tricks. Just deep, confident understanding.",
  bio3: "His students have consistently cleared CA exams on their first attempt — including those who had zero prior accounting knowledge before following his lectures.",
  pullQuote: "My goal is simple — even if you have never opened an accounting book in your life, you should be able to sit in the CA Final exam with confidence after following this series.",
  credentials: [
    "Chartered Accountant (ICAI)",
    "10+ Years Teaching Experience",
    "Mentored 2,000+ CA Students",
    "Former Faculty, Symbiosis College Pune",
  ],
  badges: ["Top-Rated Educator", "CA Final Expert", "Free on YouTube"],
};

const BADGE_ICONS = [Award, GraduationCap, ShieldCheck];

export default function AboutSection({ data = {} }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const d = { ...DEFAULTS, ...data };
  const toStr = (c: string | { _key?: string; text?: string }) => typeof c === 'string' ? c : (c.text ?? '')
  const toKey = (c: string | { _key?: string; text?: string }, i: number) => typeof c === 'string' ? c : (c._key ?? String(i))
  const rawCreds = (d.credentials && d.credentials.length > 0) ? d.credentials : DEFAULTS.credentials!
  const rawBadges = (d.badges && d.badges.length > 0) ? d.badges : DEFAULTS.badges!
  const _credentials = rawCreds.map(toStr).filter(Boolean)
  const _badges = rawBadges.map(toStr).filter(Boolean)

  const profileImageUrl = data?.profileImage?.asset?._ref
    ? urlFor(data.profileImage).url()
    : "/nikesh-shah.png";
  // Sanity CDN already optimizes images — bypass Next.js image proxy to avoid SSRF blocks on NAT64 networks
  const isSanityImage = profileImageUrl.startsWith('https://cdn.sanity.io');

  return (
    <section
      className="py-20 md:py-28 bg-white relative overflow-hidden"
      ref={ref}
      id="about"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-blue font-semibold text-sm uppercase tracking-widest mb-3">
            Your Educator
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
            Meet CA Nikesh Shah
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            A Chartered Accountant who believes every student can crack the CA exam — if taught the right way.
          </p>
        </motion.div>

        {/* Profile layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Photo + credentials */}
          <motion.div
            className="flex flex-col items-center lg:items-start gap-6"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue/20 to-teal/20 rounded-3xl blur-2xl" />
              <div className="relative w-72 h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-navy/10">
                <Image
                  src={profileImageUrl}
                  alt="CA Nikesh Shah — CA Final Educator"
                  fill
                  unoptimized={isSanityImage}
                  sizes="(max-width: 768px) 100vw, 288px"
                  className="object-cover object-top"
                  priority
                />
              </div>

              <motion.div
                className="absolute -bottom-5 -right-5 bg-navy text-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-bold">{d.credentialBadge?.split("·")[0]?.trim()}</p>
                  <p className="text-xs text-white/60">{d.credentialBadge?.split("·")[1]?.trim()}</p>
                </div>
              </motion.div>

              <motion.div
                className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 border border-gray-100"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold text-navy">{d.ratingBadge?.split(" ")[0]}</span>
                <span className="text-xs text-muted">Student Rating</span>
              </motion.div>
            </div>

            {/* Credentials list */}
            <div className="w-full max-w-sm lg:max-w-none mt-8 bg-offwhite rounded-2xl p-6 border border-gray-100">
              <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">
                Credentials &amp; Experience
              </p>
              <ul className="flex flex-col gap-3">
                {(rawCreds).map((c, i) => (
                  <li key={toKey(c, i)} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-teal flex-shrink-0" />
                    <span className="text-sm font-medium text-bodytext">{toStr(c)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right — Bio + Quote */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-6">
              <h3 className="font-display text-4xl md:text-5xl font-bold text-navy mb-2 leading-tight">
                {d.name}
              </h3>
              <p className="text-blue font-semibold text-lg">{d.title}</p>
            </div>

            <div className="space-y-4 text-bodytext text-base leading-relaxed mb-8">
              {d.bio1 && <p>{d.bio1}</p>}
              {d.bio2 && <p>{d.bio2}</p>}
              {d.bio3 && <p>{d.bio3}</p>}
            </div>

            {d.pullQuote && (
              <div className="relative bg-navy rounded-2xl p-6 mb-8">
                <div className="text-gold text-5xl font-serif leading-none mb-3 select-none">&ldquo;</div>
                <p className="text-white/90 text-lg leading-relaxed italic font-medium">{d.pullQuote}</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-8 h-0.5 bg-gold" />
                  <span className="text-gold text-sm font-semibold">CA Nikesh Shah</span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {rawBadges.map((b, idx) => {
                const Icon = BADGE_ICONS[idx % BADGE_ICONS.length];
                return (
                  <span
                    key={toKey(b, idx)}
                    className="inline-flex items-center gap-2 bg-blue/5 border border-blue/15 text-navy text-sm font-medium px-4 py-2 rounded-full"
                  >
                    <Icon className="w-4 h-4 text-blue" />
                    {toStr(b)}
                  </span>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
