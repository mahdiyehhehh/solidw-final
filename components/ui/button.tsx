"use client";

import * as React from "react";
import Link from "next/link";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "group relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-sans font-medium tracking-wide transition-all duration-300 ease-[var(--ease-luxury)] disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "facet-corner bg-gradient-to-br from-gold-200 via-gold-400 to-gold-500 text-crimson-950 shadow-[0_1px_0_0_rgba(255,255,255,0.4)_inset,0_10px_30px_-8px_rgba(212,175,106,0.5)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.5)_inset,0_14px_40px_-6px_rgba(212,175,106,0.65)]",
        secondary:
          "glass-panel border-ivory-200/15 text-ivory-50 hover:border-gold-400/40 hover:bg-white/[0.07]",
        ghost:
          "bg-transparent text-ivory-200 hover:text-gold-300",
      },
      size: {
        sm: "h-9 rounded-xl px-4 text-sm",
        md: "h-11 rounded-2xl px-6 text-[0.95rem]",
        lg: "h-14 rounded-2xl px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children">,
    VariantProps<typeof buttonVariants> {
  href?: string;
  external?: boolean;
  children: React.ReactNode;
}

/** Diagonal light sweep shown on hover — only ever used on the primary variant. */
function Sheen() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      <span className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition-all duration-700 ease-[var(--ease-luxury)] group-hover:left-[120%] group-hover:opacity-70" />
    </span>
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, external, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);

    if (href) {
      return (
        <Link
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className={classes}
        >
          {variant === "primary" && <Sheen />}
          {children}
        </Link>
      );
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={classes}
        {...props}
      >
        {variant === "primary" && <Sheen />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
