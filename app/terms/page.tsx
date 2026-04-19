import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/lib/sanity/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Terms of Service — NS Academy",
  description: "Terms of Service for NS Academy.",
};

export default async function TermsPage() {
  let email = "contact@nsacademy.in";
  try {
    const data = await client.fetch<{ contact?: { email?: string } }>(
      `*[_type == "siteContent"][0]{ contact }`
    );
    if (data?.contact?.email) email = data.contact.email;
  } catch {}

  return (
    <div className="min-h-screen bg-offwhite pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 md:p-16 text-center">
          <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-heading text-3xl font-bold text-navy mb-4">Terms of Service</h1>
          <p className="text-muted text-lg mb-8">Our full terms of service are being prepared.</p>
          <p className="text-sm text-muted/70 mb-8">
            For any queries, contact us at{" "}
            <a href={`mailto:${email}`} className="text-blue hover:underline">
              {email}
            </a>
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-semibold hover:bg-navy/90 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
