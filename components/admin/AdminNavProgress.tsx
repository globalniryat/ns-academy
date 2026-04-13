"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Top-of-page navigation progress bar.
 * - Starts on any internal link click (covers sidebar nav + all admin links)
 * - Completes automatically when the pathname changes (route settled)
 * - Safe: ignores external links, anchor links, and non-link clicks
 */
export default function AdminNavProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [width, setWidth] = useState(0);

  const prevPathname = useRef(pathname);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearAll() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (doneTimer.current) clearTimeout(doneTimer.current);
    intervalRef.current = null;
    doneTimer.current = null;
  }

  function startProgress() {
    clearAll();
    setActive(true);
    setWidth(8);

    let current = 8;
    intervalRef.current = setInterval(() => {
      // Simulate easing: fast at start, slows near 85%
      const step = current < 40 ? 12 : current < 65 ? 6 : current < 80 ? 3 : 1;
      current = Math.min(current + step + Math.random() * 3, 85);
      setWidth(current);
    }, 250);
  }

  function finishProgress() {
    clearAll();
    setWidth(100);
    doneTimer.current = setTimeout(() => {
      setActive(false);
      setWidth(0);
    }, 380);
  }

  // Listen for clicks on internal links to kick off the bar
  useEffect(() => {
    function onLinkClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      // Skip external, anchor-only, mailto, tel, and same page
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("//") ||
        href.startsWith("#") ||
        href.startsWith("mailto") ||
        href.startsWith("tel")
      )
        return;
      // Skip if same path (no navigation will happen)
      if (href === pathname) return;

      startProgress();
    }

    document.addEventListener("click", onLinkClick);
    return () => document.removeEventListener("click", onLinkClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // When the route settles, finish the bar
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      finishProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!active && width === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-[3px] bg-green-500 shadow-[0_0_8px_rgba(22,163,74,0.6)]"
        style={{
          width: `${width}%`,
          transition: width === 100 ? "width 0.2s ease-out" : "width 0.25s ease",
          opacity: active || width > 0 ? 1 : 0,
        }}
      />
    </div>
  );
}
