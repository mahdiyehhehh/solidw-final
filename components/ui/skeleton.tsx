import { cn } from "@/lib/utils";

/**
 * A single shimmering placeholder block. Compose several of these to
 * build a loading skeleton that roughly matches the shape of the real
 * content — see app/dashboard/loading.tsx for an example.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-xl bg-white/[0.06]", className)}
    />
  );
}
