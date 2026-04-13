"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ScrollToTop } from "@/components/shared/ScrollToTop";

export default function ConditionalPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
