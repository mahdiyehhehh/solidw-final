import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/glass-card";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your SolidW account.",
};

export default function SignupPage() {
  return (
    <GlassCard goldBorder className="w-full">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400/80">
        Get started
      </p>
      <h1 className="mt-4 font-display text-3xl font-medium text-ivory-50">
        Create your account
      </h1>
      <p className="mt-3 leading-relaxed text-ivory-200/75">
        Set up your branded booking page in minutes.
      </p>

      <div className="mt-8">
        <SignupForm />
      </div>
    </GlassCard>
  );
}
