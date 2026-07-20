import * as React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  eyebrow,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <GlassCard goldBorder className={cn("text-center", className)}>
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400/80">
          {eyebrow}
        </p>
      )}
      <h2 className="mx-auto mt-4 max-w-md font-display text-2xl font-medium text-ivory-50 sm:text-3xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-md leading-relaxed text-ivory-200/75">
        {description}
      </p>
      {action && <div className="mt-8 flex justify-center">{action}</div>}
    </GlassCard>
  );
}
