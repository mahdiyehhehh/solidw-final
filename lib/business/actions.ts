"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isBusinessCategory } from "@/lib/business/categories";
import type { BusinessInsert, BusinessUpdate } from "@/lib/business/types";

export interface BusinessFormState {
  error?: string;
  success?: boolean;
}

type ParsedBusinessInput = Omit<BusinessInsert, "user_id">;

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Shared parsing + validation for both create and update — the two forms
 * submit the same fields, so the rules only need to live in one place.
 */
function parseBusinessForm(formData: FormData): ParsedBusinessInput | { error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = emptyToNull(String(formData.get("description") ?? ""));
  const contactEmail = emptyToNull(String(formData.get("contactEmail") ?? ""));
  const contactPhone = emptyToNull(String(formData.get("contactPhone") ?? ""));
  const address = emptyToNull(String(formData.get("address") ?? ""));
  const city = String(formData.get("city") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const logoUrl = emptyToNull(String(formData.get("logoUrl") ?? ""));

  if (name.length < 2 || name.length > 80) {
    return { error: "Business name should be between 2 and 80 characters." };
  }
  if (!isBusinessCategory(category)) {
    return { error: "Choose a business category." };
  }
  if (description && description.length > 600) {
    return { error: "Description should be 600 characters or fewer." };
  }
  if (!city) {
    return { error: "City is required." };
  }
  if (!country) {
    return { error: "Country is required." };
  }
  if (!contactEmail && !contactPhone) {
    return {
      error:
        "Add at least one way for customers to reach you — an email or a phone number.",
    };
  }
  if (contactEmail && !isValidEmail(contactEmail)) {
    return { error: "Enter a valid contact email." };
  }
  if (logoUrl && !isValidUrl(logoUrl)) {
    return { error: "Logo URL should be a full link, e.g. https://…" };
  }

  return {
    name,
    category,
    description,
    contact_email: contactEmail,
    contact_phone: contactPhone,
    address,
    city,
    country,
    logo_url: logoUrl,
  };
}

export async function createBusiness(
  _prevState: BusinessFormState,
  formData: FormData
): Promise<BusinessFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const parsed = parseBusinessForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const { error } = await supabase.from("businesses").insert({
    ...parsed,
    user_id: user.id,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  if (error) {
    // Postgres unique_violation — the user already has a business row.
    if (error.code === "23505") {
      return { error: "You already have a business profile." };
    }
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateBusiness(
  _prevState: BusinessFormState,
  formData: FormData
): Promise<BusinessFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const parsed = parseBusinessForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const update: BusinessUpdate = parsed;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("businesses")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(update as any)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return { success: true };
}
