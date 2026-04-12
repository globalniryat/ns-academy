import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy — CA Portal",
  description: "Refund Policy for CA Portal online learning platform.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-offwhite pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 md:p-16 text-center">
          <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </div>
          <h1 className="font-heading text-3xl font-bold text-navy mb-4">Refund Policy</h1>
          <p className="text-muted text-lg mb-4">
            We offer a <strong className="text-navy">30-day money-back guarantee</strong> on all courses.
          </p>
          <p className="text-sm text-muted/70 mb-8">
            If you&apos;re not satisfied for any reason within 30 days of purchase, contact us and we&apos;ll issue a full refund — no questions asked.
            Reach us at{" "}
            <a href="mailto:contact@caportal.in" className="text-blue hover:underline">
              contact@caportal.in
            </a>
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-semibold hover:bg-navy/90 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
