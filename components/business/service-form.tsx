"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  createService,
  updateService,
  type ServiceFormState,
} from "@/lib/services/actions";
import type { Service } from "@/lib/services/types";

const initialState: ServiceFormState = {};

export interface ServiceFormProps {
  mode: "create" | "edit";
  service?: Service;
}

/**
 * Used at both /dashboard/services/new (mode="create") and
 * /dashboard/services/[id]/edit (mode="edit", pre-filled) — mirrors the
 * BusinessForm pattern from Module 3.
 */
export function ServiceForm({ mode, service }: ServiceFormProps) {
  const action = mode === "create" ? createService : updateService;
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {mode === "edit" && service && (
        <input type="hidden" name="serviceId" value={service.id} />
      )}

      <Input
        label="Service name"
        name="name"
        placeholder="e.g. Classic Haircut"
        defaultValue={service?.name}
        required
        maxLength={100}
      />

      <Textarea
        label="Description"
        name="description"
        placeholder="What's included, what to expect…"
        defaultValue={service?.description ?? ""}
        hint="Optional, up to 500 characters"
        maxLength={500}
        rows={3}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Duration (minutes)"
          name="durationMinutes"
          type="number"
          inputMode="numeric"
          placeholder="30"
          defaultValue={service?.duration_minutes}
          min={1}
          max={1440}
          required
        />
        <Input
          label="Price"
          name="price"
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          step="0.01"
          defaultValue={service?.price}
          min={0}
          required
        />
      </div>

      <label className="flex items-center gap-3 text-sm text-ivory-200/80">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={service ? service.is_active : true}
          className="h-4 w-4 rounded border-ivory-200/30 bg-white/[0.04] accent-gold-400"
        />
        Visible to customers on your public booking page
      </label>

      {state?.error && <p className="text-sm text-red-300">{state.error}</p>}

      <Button
        type="submit"
        size="lg"
        className="mt-2 w-full sm:w-auto"
        disabled={isPending}
      >
        {isPending
          ? mode === "create"
            ? "Adding…"
            : "Saving…"
          : mode === "create"
            ? "Add service"
            : "Save changes"}
      </Button>
    </form>
  );
}
