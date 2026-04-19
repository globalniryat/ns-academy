"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Star, Clock } from "lucide-react";

function YoutubeSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  )
}

export interface StatItem {
  _key?: string;
  value?: string;
  label?: string;
}

interface Props {
  data?: StatItem[];
}

const ICON_STYLES = [
  { icon: Users, color: "text-blue", bg: "bg-blue/10" },
  { icon: Star, color: "text-gold", bg: "bg-gold/10" },
  { icon: Clock, color: "text-teal", bg: "bg-teal/10" },
  { icon: YoutubeSvg, color: "text-red-500", bg: "bg-red-50" },
];

const DEFAULTS: StatItem[] = [
  { value: "2,000+", label: "Students Mentored" },
  { value: "4.9 / 5", label: "Average Student Rating" },
  { value: "35 Hrs", label: "Structured Video Content" },
  { value: "Free", label: "Available on YouTube" },
];

export default function StatsBar({ data }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const stats = (data && data.length > 0) ? data : DEFAULTS;

  return (
    <section className="py-12 bg-white border-b border-gray-100" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const style = ICON_STYLES[i % ICON_STYLES.length];
            const Icon = style.icon;
            return (
              <motion.div
                key={stat.label}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-xl hover:bg-offwhite transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className={`w-12 h-12 ${style.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${style.color}`} />
                </div>
                <div className="text-center sm:text-left">
                  <p className={`text-2xl font-bold ${style.color}`}>{stat.value}</p>
                  <p className="text-muted text-sm">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
