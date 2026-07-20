"use client";

import { useActionState, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  createAppointment,
  type BookingFormState,
} from "@/lib/appointments/actions";
import { formatPrice } from "@/lib/services/format";
import type { Service } from "@/lib/services/types";

const initialState: BookingFormState = {};

function todayIsoDate(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

export interface BookingFormProps {
  businessId: string;
  services: Service[];
}

export function BookingForm({ businessId, services }: BookingFormProps) {
  const [state, formAction, isPending] = useActionState(
    createAppointment,
    initialState
  );
  const [selectedServiceId, setSelectedServiceId] = useState(
    services[0]?.id ?? ""
  );

  const serviceOptions = useMemo(
    () =>
      services.map((service) => ({
        value: service.id,
        label: `${service.name} — ${formatPrice(service.price)}`,
      })),
    [services]
  );

  const minDate = todayIsoDate();

  if (state?.success) {
    return (
      <GlassCard goldBorder className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400/80">
          Request sent
        </p>
        <h3 className="mx-auto mt-4 max-w-md font-display text-2xl font-medium text-ivory-50">
          Thanks — your booking request is in.
        </h3>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-ivory-200/75">
          The business will reach out to confirm your appointment.
        </p>
      </GlassCard>
    );
  }

  if (services.length === 0) {
    return (
      <GlassCard className="text-center">
        <p className="leading-relaxed text-ivory-200/75">
          This business hasn&apos;t added any bookable services yet. Check
          back soon.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard goldBorder>
      <form action={formAction} className="flex flex-col gap-6">
        <input type="hidden" name="businessId" value={businessId} />

        <Select
          label="Service"
          name="serviceId"
          options={serviceOptions}
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          required
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Date"
            name="appointmentDate"
            type="date"
            min={minDate}
            required
          />
          <Input label="Time" name="appointmentTime" type="time" required />
        </div>

        <Input
          label="Your name"
          name="customerName"
          placeholder="Jane Doe"
          autoComplete="name"
          required
          maxLength={100}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Phone"
            name="customerPhone"
            type="tel"
            placeholder="+1 555 000 0000"
            autoComplete="tel"
            required
          />
          <Input
            label="Email"
            name="customerEmail"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <p className="-mt-3 text-xs text-ivory-400/60">Email is optional.</p>

        <Textarea
          label="Notes"
          name="notes"
          placeholder="Anything the business should know?"
          hint="Optional, up to 500 characters"
          maxLength={500}
          rows={3}
        />

        {state?.error && <p className="text-sm text-red-300">{state.error}</p>}

        <Button
          type="submit"
          size="lg"
          className="mt-2 w-full sm:w-auto"
          disabled={isPending}
        >
          {isPending ? "Sending…" : "Request booking"}
        </Button>
      </form>
    </GlassCard>
  );
}
