import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — CA Portal",
  description: "Privacy Policy for CA Portal online learning platform.",
};

function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-screen bg-offwhite pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 md:p-16 text-center">
          <div className="w-16 h-16 bg-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="font-heading text-3xl font-bold text-navy mb-4">{title}</h1>
          <p className="text-muted text-lg mb-8">{description}</p>
          <p className="text-sm text-muted/70 mb-8">
            This page is currently being prepared. Please check back soon or contact us at{" "}
            <a href="mailto:contact@caportal.in" className="text-blue hover:underline">
              contact@caportal.in
            </a>{" "}
            for any questions.
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

export default function PrivacyPage() {
  return (
    <PlaceholderPage
      title="Privacy Policy"
      description="We care about your data. Our full privacy policy is coming soon."
    />
  );
}
