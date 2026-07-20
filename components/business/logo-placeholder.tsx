import { cn } from "@/lib/utils";

export interface LogoPlaceholderProps {
  name: string;
  logoUrl?: string | null;
  size?: "md" | "lg";
  className?: string;
}

const sizeMap = {
  md: "h-16 w-16 text-lg",
  lg: "h-24 w-24 text-2xl",
} as const;

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ?? "";
  const second = parts[1] ?? "";

  if (!first) return "?";
  if (!second) return first.slice(0, 2).toUpperCase();
  return (first.charAt(0) + second.charAt(0)).toUpperCase();
}

/**
 * Shows the business's logo if `logoUrl` is set, otherwise a gold-on-glass
 * initials avatar. There's no upload flow yet (see BusinessForm) — this is
 * the "placeholder" called for in the Module 3 brief, wired up so a real
 * image slots in later without any change here.
 */
export function LogoPlaceholder({
  name,
  logoUrl,
  size = "md",
  className,
}: LogoPlaceholderProps) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- arbitrary
      // user-supplied external URL; next/image would require configuring
      // remote patterns for domains we can't know ahead of time.
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className={cn(
          "rounded-2xl border border-gold-400/20 object-cover",
          sizeMap[size],
          className
        )}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center rounded-2xl border border-gold-400/20 bg-gradient-to-br from-gold-400/15 to-transparent font-display font-medium text-gold-300",
        sizeMap[size],
        className
      )}
    >
      {initials(name)}
    </div>
  );
}
