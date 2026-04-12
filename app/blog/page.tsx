import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — CA Portal",
  description: "CA exam tips, study strategies, and coaching insights from CA Portal.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-offwhite pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 md:p-16 text-center">
          <div className="w-16 h-16 bg-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <h1 className="font-heading text-3xl font-bold text-navy mb-4">CA Portal Blog</h1>
          <p className="text-muted text-lg mb-8">
            Study tips, exam strategies, and insights for CA aspirants — coming soon.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-semibold hover:bg-navy/90 transition-colors"
          >
            Browse Courses Instead
          </Link>
        </div>
      </div>
    </div>
  );
}
