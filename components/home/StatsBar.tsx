"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Users, ShieldCheck, Star, Clock } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "2,000+",
    label: "Students Mentored",
    color: "text-blue",
    bg: "bg-blue/10",
  },
  {
    icon: Star,
    value: "4.9 / 5",
    label: "Average Student Rating",
    color: "text-gold",
    bg: "bg-gold/10",
  },
  {
    icon: Clock,
    value: "35 Hrs",
    label: "Structured Video Content",
    color: "text-teal",
    bg: "bg-teal/10",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "Money-Back Guarantee",
    color: "text-green-600",
    bg: "bg-green-50",
  },
];

export default function StatsBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-12 bg-white border-b border-gray-100" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-xl hover:bg-offwhite transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-center sm:text-left">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-muted text-sm">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
