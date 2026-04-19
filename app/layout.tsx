import type { Metadata } from "next";
import { Inter, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import ConditionalPublicLayout from "@/components/layout/ConditionalPublicLayout";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { SanityLive } from "@/sanity/lib/live";
import { client } from "@/lib/sanity/client";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NS Academy — Learn CA Final SFM Free on YouTube | CA Nikesh Shah",
  description:
    "CA Nikesh Shah teaches the complete CA Final Strategic Financial Management series free on YouTube. Logic-first approach — zero memorization, zero prior knowledge needed.",
  keywords:
    "CA Final SFM free YouTube, CA Nikesh Shah, NS Academy, CA Final coaching, Symbiosis College Pune",
  openGraph: {
    title: "NS Academy — CA Final SFM Free on YouTube by CA Nikesh Shah",
    description:
      "Free CA Final SFM lecture series by CA Nikesh Shah. Logic-first teaching. New lectures every week.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let whatsappNumber = "91XXXXXXXXXX";
  let whatsappMessage = "Hi CA Nikesh Shah, I watched your YouTube series and wanted to get in touch.";

  try {
    const content = await client.fetch(`*[_type == "siteContent"][0]{ contact }`);
    if (content?.contact?.whatsappNumber) whatsappNumber = content.contact.whatsappNumber;
    if (content?.contact?.whatsappMessage) whatsappMessage = content.contact.whatsappMessage;
  } catch {
    // Sanity not configured yet — use defaults
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jakarta.variable} scroll-auto`}
    >
   <body suppressHydrationWarning>
        <ConditionalPublicLayout>{children}</ConditionalPublicLayout>
        <WhatsAppButton number={whatsappNumber} message={whatsappMessage} />
        <SanityLive />
        {(await draftMode()).isEnabled && <VisualEditing />}
      </body>
    </html>
  );
}
