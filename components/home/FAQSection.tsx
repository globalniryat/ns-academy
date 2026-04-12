"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface Props {
  faqs?: FAQItem[];
}

export default function FAQSection({ faqs = [] }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-white" ref={ref} id="faq">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-blue font-semibold text-sm uppercase tracking-widest mb-3">
            Got Questions?
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted">
            Everything you need to know before enrolling. Can&apos;t find an answer?{" "}
            <a href="mailto:contact@nsacademy.com" className="text-blue hover:underline">
              Email us
            </a>
            .
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.id}
              className="border border-gray-200 rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-offwhite transition-colors"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                <span className="font-semibold text-navy text-sm pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted flex-shrink-0 transition-transform ${
                    openIdx === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIdx === i && (
                <div className="px-5 pb-4 border-t border-gray-100">
                  <p className="text-bodytext text-sm leading-relaxed pt-3">{faq.answer}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
