"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Brightens the border to signal emphasis (e.g. the featured plan). */
  goldBorder?: boolean;
  /** Stagger delay in seconds, useful when rendering a grid of cards. */
  delay?: number;
}

export function GlassCard({
  className,
  goldBorder = false,
  delay = 0,
  children,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "glass-panel p-6 sm:p-8",
        goldBorder && "border-gold-400/30",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
