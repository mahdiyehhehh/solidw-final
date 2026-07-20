"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BUSINESS_CATEGORIES } from "@/lib/business/categories";
import {
  createBusiness,
  updateBusiness,
  type BusinessFormState,
} from "@/lib/business/actions";
import type { Business } from "@/lib/business/types";

const initialState: BusinessFormState = {};

const categoryOptions = BUSINESS_CATEGORIES.map((category) => ({
  value: category,
  label: category,
}));

export interface BusinessFormProps {
  mode: "create" | "edit";
  business?: Business;
}

/**
 * Used at both /dashboard/onboarding (mode="create") and
 * /dashboard/settings (mode="edit", pre-filled). The two server actions
 * share identical field parsing, so swapping which one the form calls is
 * the only difference between the two modes.
 */
export function BusinessForm({ mode, business }: BusinessFormProps) {
  const action = mode === "create" ? createBusiness : updateBusiness;
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Input
        label="Business name"
        name="name"
        placeholder="e.g. Marigold Hair Studio"
        defaultValue={business?.name}
        required
        maxLength={80}
      />

      <Select
        label="Business type"
        name="category"
        placeholder="Choose a category"
        defaultValue={business?.category ?? ""}
        options={categoryOptions}
        required
      />

      <Textarea
        label="Description"
        name="description"
        placeholder="What do you offer, and what makes it worth booking?"
        defaultValue={business?.description ?? ""}
        hint="Optional, up to 600 characters"
        maxLength={600}
        rows={4}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Contact email"
          name="contactEmail"
          type="email"
          placeholder="you@business.com"
          defaultValue={business?.contact_email ?? ""}
          autoComplete="email"
        />
        <Input
          label="Contact phone"
          name="contactPhone"
          type="tel"
          placeholder="+1 555 000 0000"
          defaultValue={business?.contact_phone ?? ""}
          autoComplete="tel"
        />
      </div>
      <p className="-mt-3 text-xs text-ivory-400/60">
        Add at least one — this is how customers reach you to book.
      </p>

      <Input
        label="Address"
        name="address"
        placeholder="Street, neighborhood (optional)"
        defaultValue={business?.address ?? ""}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="City"
          name="city"
          placeholder="e.g. Austin"
          defaultValue={business?.city}
          required
        />
        <Input
          label="Country"
          name="country"
          placeholder="e.g. United States"
          defaultValue={business?.country}
          required
        />
      </div>

      <Input
        label="Logo URL"
        name="logoUrl"
        type="url"
        placeholder="https://…"
        defaultValue={business?.logo_url ?? ""}
      />
      <p className="-mt-3 text-xs text-ivory-400/60">
        Optional. Paste a hosted image link — direct logo upload is coming
        soon. Leave blank to use your initials instead.
      </p>

      {state?.error && <p className="text-sm text-red-300">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-gold-300">
          Your business profile has been updated.
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="mt-2 w-full sm:w-auto"
        disabled={isPending}
      >
        {isPending
          ? mode === "create"
            ? "Setting up…"
            : "Saving…"
          : mode === "create"
            ? "Set up my business"
            : "Save changes"}
      </Button>
    </form>
  );
}
