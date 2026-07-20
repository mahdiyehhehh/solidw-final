"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { login, type AuthFormState } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: AuthFormState = {};

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const confirmationFailed = searchParams.get("error") === "confirmation_failed";
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />

      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@business.com"
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        required
      />

      {state?.error && <p className="text-sm text-red-300">{state.error}</p>}
      {!state?.error && confirmationFailed && (
        <p className="text-sm text-red-300">
          That confirmation link is invalid or expired. Please sign in or
          request a new one.
        </p>
      )}

      <Button type="submit" size="lg" className="mt-2 w-full" disabled={isPending}>
        {isPending ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-sm text-ivory-200/70">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-gold-300 hover:text-gold-200">
          Create one
        </Link>
      </p>
    </form>
  );
}
