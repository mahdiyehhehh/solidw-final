import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

/**
 * Native <select>, styled to match Input. Kept dependency-free (no
 * headless UI library) since a plain select already gets us correct
 * mobile behavior — the OS picker — for free.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, placeholder, ...props }, ref) => {
    const selectId = id ?? props.name;

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={selectId}
          className="font-mono text-xs uppercase tracking-[0.2em] text-ivory-200/70"
        >
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "h-12 w-full appearance-none rounded-xl border border-ivory-200/15 bg-white/[0.04] px-4 pr-10 text-[0.95rem] text-ivory-50 outline-none transition-colors duration-300 focus:border-gold-400/50 focus:bg-white/[0.06]",
              error && "border-red-400/50 focus:border-red-400/60",
              className
            )}
            aria-invalid={error ? true : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden className="bg-crimson-900 text-ivory-400">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-crimson-900 text-ivory-50">
                {option.label}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory-200/50"
          >
            <path
              d="M5 7.5 10 12.5 15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {error && <p className="text-sm text-red-300">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
