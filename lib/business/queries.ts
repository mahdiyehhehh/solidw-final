import { createClient } from "@/lib/supabase/server";
import type { Business } from "@/lib/business/types";

/**
 * Returns the business owned by the given user, or null if they haven't
 * completed onboarding yet. Relies entirely on RLS (`auth.uid() = user_id`)
 * rather than filtering defensively in application code — the query below
 * would return nothing for another user's id even without the `.eq()`.
 */
export async function getBusinessForUser(userId: string): Promise<Business | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load business:", error.message);
    return null;
  }

  return data;
}

/**
 * Returns the business with the given public slug, or null if no
 * business has claimed it. Used by the public business page — relies on
 * the "Anyone can view businesses" RLS policy, so this works for
 * signed-out visitors as well.
 */
export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to load business by slug:", error.message);
    return null;
  }

  return data;
}
