import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/lib/services/types";

/**
 * Returns every service (active and disabled) belonging to a business.
 * Meant for the owner's dashboard — relies on the "Business owners can
 * view all their services" RLS policy, so it only ever returns rows for
 * the signed-in owner's own business regardless of the id passed in.
 */
export async function getServicesForOwner(businessId: string): Promise<Service[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load services:", error.message);
    return [];
  }

  return data;
}

/**
 * Returns only the active services for a business. Meant for the public
 * business page — relies on the "Anyone can view active services" RLS
 * policy, so it works for signed-out visitors.
 */
export async function getActiveServicesForBusiness(
  businessId: string
): Promise<Service[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("business_id", businessId)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load active services:", error.message);
    return [];
  }

  return data;
}

/**
 * Returns a single service by id, scoped to the given business. Used by
 * the edit-service page — the extra `business_id` check is redundant
 * with RLS but keeps a stray id from another business from ever
 * resolving here even if a policy is ever loosened.
 */
export async function getServiceForOwner(
  serviceId: string,
  businessId: string
): Promise<Service | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .eq("business_id", businessId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load service:", error.message);
    return null;
  }

  return data;
}
