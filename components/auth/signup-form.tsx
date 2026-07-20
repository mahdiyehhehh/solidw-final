"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup, type AuthFormState } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: AuthFormState = {};

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, initialState);

  if (state?.success) {
    return (
      <div className="text-center">
        <p className="font-display text-xl font-medium text-ivory-50">
          Check your inbox
        </p>
        <p className="mt-3 leading-relaxed text-ivory-200/75">
          We sent a confirmation link to your email. Follow it to activate
          your account, then come back and sign in.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm text-gold-300 hover:text-gold-200"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
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
        autoComplete="new-password"
        placeholder="At least 8 characters"
        required
      />
      <Input
        label="Confirm password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        required
      />

      {state?.error && <p className="text-sm text-red-300">{state.error}</p>}

      <Button type="submit" size="lg" className="mt-2 w-full" disabled={isPending}>
        {isPending ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-ivory-200/70">
        Already have an account?{" "}
        <Link href="/login" className="text-gold-300 hover:text-gold-200">
          Sign in
        </Link>
      </p>
    </form>
  );
}
