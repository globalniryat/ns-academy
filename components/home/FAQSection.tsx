"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  _key?: string;
  id?: string;
  question?: string;
  answer?: string;
}

export interface FAQData {
  sectionLabel?: string;
  heading?: string;
  subtext?: string;
  emailLinkText?: string;
  email?: string;
  items?: FAQItem[];
}

interface Props {
  data?: FAQData;
  faqs?: FAQItem[];
}

export default function FAQSection({ data, faqs: legacyFaqs }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const sectionLabel = data?.sectionLabel ?? "GOT QUESTIONS?";
  const heading = data?.heading ?? "Frequently Asked Questions";
  const subtext = data?.subtext ?? "Everything you need to know.";
  const emailLinkText = data?.emailLinkText ?? "Email us";
  const email = data?.email ?? "contact@nsacademy.in";
  const DEFAULT_ITEMS: FAQItem[] = [
    { question: "What topics does the CA Final SFM series cover?", answer: "The series covers the complete CA Final SFM syllabus: Portfolio Theory & CAPM, Derivatives (Options & Futures), Foreign Exchange Management, Corporate Valuation, Mergers & Acquisitions, Interest Rate Risk Management, and more — all mapped to the ICAI exam pattern." },
    { question: "Do I need prior finance knowledge to start?", answer: "No. The series starts from absolute zero. CA Nikesh Shah builds every concept from first principles using logic — if you understand basic arithmetic, you are ready to begin." },
    { question: "How often are new lectures uploaded?", answer: "New lectures are added every week. Subscribe to the YouTube channel and turn on notifications so you never miss an upload." },
    { question: "Is this useful for the ICAI CA Final exam?", answer: "Yes. Every lecture is mapped directly to the ICAI CA Final SFM syllabus. The focus is on building the kind of deep understanding that helps in both theory and numerical questions under exam pressure." },
    { question: "Can I watch on my mobile or tablet?", answer: "Absolutely — the entire series is on YouTube and works on any device: phone, tablet, laptop, or desktop. No app, no login, no download required." },
    { question: "How do I get help if I am stuck on a concept?", answer: "Drop a comment on the YouTube video — CA Nikesh Shah personally reads and replies to student questions. For direct queries, reach out via WhatsApp or the Contact page." },
  ];

  const items: FAQItem[] = data?.items ?? legacyFaqs ?? DEFAULT_ITEMS;

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
            {sectionLabel}
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
            {heading}
          </h2>
          <p className="text-muted">
            {subtext}{" "}
            <a href={`mailto:${email}`} className="text-blue hover:underline">
              {emailLinkText}
            </a>
            .
          </p>
        </motion.div>

        <div className="space-y-3">
          {items.map((faq, i) => (
            <motion.div
              key={faq._key ?? faq.id ?? faq.question}
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
                  className={`w-5 h-5 text-muted flex-shrink-0 transition-transform ${openIdx === i ? "rotate-180" : ""}`}
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
