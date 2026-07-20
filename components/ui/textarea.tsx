import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id ?? props.name;

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <label
            htmlFor={textareaId}
            className="font-mono text-xs uppercase tracking-[0.2em] text-ivory-200/70"
          >
            {label}
          </label>
          {hint && <span className="text-xs text-ivory-400/60">{hint}</span>}
        </div>
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "min-h-[120px] w-full resize-y rounded-xl border border-ivory-200/15 bg-white/[0.04] px-4 py-3 text-[0.95rem] leading-relaxed text-ivory-50 placeholder:text-ivory-400/50 outline-none transition-colors duration-300 focus:border-gold-400/50 focus:bg-white/[0.06]",
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

Textarea.displayName = "Textarea";
