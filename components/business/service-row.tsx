"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteService, toggleServiceActive } from "@/lib/services/actions";
import { formatDuration, formatPrice } from "@/lib/services/format";
import type { Service } from "@/lib/services/types";
import { cn } from "@/lib/utils";

export function ServiceRow({ service }: { service: Service }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-4 border-b border-ivory-200/10 py-6 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="truncate font-display text-lg font-medium text-ivory-50">
            {service.name}
          </h3>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.15em]",
              service.is_active
                ? "bg-gold-400/15 text-gold-300"
                : "bg-white/[0.06] text-ivory-400/70"
            )}
          >
            {service.is_active ? "Active" : "Disabled"}
          </span>
        </div>
        {service.description && (
          <p className="mt-1 line-clamp-2 text-sm text-ivory-200/70">
            {service.description}
          </p>
        )}
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-ivory-200/50">
          {formatDuration(service.duration_minutes)} · {formatPrice(service.price)}
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await toggleServiceActive(service.id, !service.is_active);
            })
          }
        >
          {service.is_active ? "Disable" : "Enable"}
        </Button>
        <Button href={`/dashboard/services/${service.id}/edit`} variant="secondary" size="sm">
          Edit
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          className="text-red-300 hover:text-red-200"
          onClick={() => {
            if (confirm(`Delete "${service.name}"? This can't be undone.`)) {
              startTransition(async () => {
                await deleteService(service.id);
              });
            }
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
