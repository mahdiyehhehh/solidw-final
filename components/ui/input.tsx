import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * Text input styled to match the glass-panel surfaces used across SolidW.
 * Not part of Module 1 — introduced here because auth forms are the first
 * feature that needs a text field.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={inputId}
          className="font-mono text-xs uppercase tracking-[0.2em] text-ivory-200/70"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-12 w-full rounded-xl border border-ivory-200/15 bg-white/[0.04] px-4 text-[0.95rem] text-ivory-50 placeholder:text-ivory-400/50 outline-none transition-colors duration-300 focus:border-gold-400/50 focus:bg-white/[0.06]",
            error && "border-red-400/50 focus:border-red-400/60",
            className
          )}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {error && <p className="text-sm text-red-300">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
