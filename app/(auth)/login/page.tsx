import type { Metadata } from "next";
import { Suspense } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your SolidW account.",
};

export default function LoginPage() {
  return (
    <GlassCard goldBorder className="w-full">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400/80">
        Welcome back
      </p>
      <h1 className="mt-4 font-display text-3xl font-medium text-ivory-50">
        Sign in to SolidW
      </h1>
      <p className="mt-3 leading-relaxed text-ivory-200/75">
        Manage your booking page and incoming requests.
      </p>

      <div className="mt-8">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </GlassCard>
  );
}
