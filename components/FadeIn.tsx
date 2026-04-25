"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** HTML element rendered. Defaults to a div. */
  as?: "div" | "section" | "article" | "li";
}

/**
 * Fades and slides in once when scrolled into view. Honors prefers-reduced-motion.
 */
export function FadeIn({ children, delay = 0, className, as = "div" }: FadeInProps) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  return (
    <Component
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </Component>
  );
}
