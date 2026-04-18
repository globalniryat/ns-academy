"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { ScrollToTop } from "@/components/shared/ScrollToTop";

export default function ConditionalPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
