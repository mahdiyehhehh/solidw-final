/**
 * Postgres `numeric` columns (like `services.price`) come back from
 * Supabase as strings, not JS numbers, to avoid silent precision loss —
 * our hand-written Database type still says `number` for convenience,
 * so every formatter here coerces defensively before using it.
 */
export function formatPrice(price: number | string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price));
}

export function formatDuration(minutes: number | string): string {
  const total = Number(minutes);
  if (total < 60) return `${total} min`;
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  return rest > 0 ? `${hours}h ${rest}m` : `${hours}h`;
}
