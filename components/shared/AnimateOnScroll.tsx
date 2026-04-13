"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export default function AnimateOnScroll({
  children,
  className,
  delay = 0,
  once = true,
  direction = "up",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-50px" });

  const directionOffset = {
    up: { y: 24, x: 0 },
    down: { y: -24, x: 0 },
    left: { y: 0, x: 24 },
    right: { y: 0, x: -24 },
    none: { y: 0, x: 0 },
  };

  const { x, y } = directionOffset[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x, y }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
