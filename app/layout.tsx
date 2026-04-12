import type { Metadata } from "next";
import { Inter, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";

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
  title: "NS Academy — CA Finals with Simplified Logic | CA Nikesh Shah",
  description:
    "Pass CA Finals with logic-based teaching from CA Nikesh Shah. No memorization required. 100% money-back guarantee. Courses for CA Final SFM and more.",
  keywords:
    "CA coaching online, CA Final SFM, CA Nikesh Shah, NS Academy, Symbiosis College Pune, CA Finals coaching",
  openGraph: {
    title: "NS Academy — CA Finals Coaching by CA Nikesh Shah",
    description:
      "Logic-first CA Finals coaching. Pass even with zero prior knowledge. 100% money-back guarantee.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jakarta.variable} scroll-auto`}
    >
      <body>
        <ScrollToTop />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
