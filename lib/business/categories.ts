/**
 * Curated business categories offered in the onboarding / settings form.
 * Kept as plain text in the database (not a Postgres enum) so this list
 * can grow without a migration — just add an entry here.
 */
export const BUSINESS_CATEGORIES = [
  "Beauty & Spa",
  "Hair & Barber",
  "Fitness & Wellness",
  "Health & Medical",
  "Restaurant & Food",
  "Home & Repair Services",
  "Professional Services",
  "Events & Entertainment",
  "Automotive",
  "Education & Tutoring",
  "Retail & Shopping",
  "Other",
] as const;

export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number];

export function isBusinessCategory(value: string): value is BusinessCategory {
  return (BUSINESS_CATEGORIES as readonly string[]).includes(value);
}
