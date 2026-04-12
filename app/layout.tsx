import type { Metadata } from "next";
import { Inter, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth";
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
  title: "CA Portal — Expert CA Coaching Online | Foundation, Inter & Final",
  description:
    "Clear your CA exams with structured video courses. Watch free lectures, enroll when ready. Pay once, access forever. Courses for CA Foundation, Intermediate & Final.",
  keywords:
    "CA coaching online, CA Foundation course, CA Inter course, CA Final course, ICAI exam preparation",
  openGraph: {
    title: "CA Portal — Expert CA Coaching Online",
    description:
      "Expert-led video courses for CA Foundation, Intermediate & Final. Watch free lectures, then enroll when ready.",
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
        <AuthProvider>
          <ScrollToTop />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
