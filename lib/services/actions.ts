"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getBusinessForUser } from "@/lib/business/queries";
import type { ServiceInsert, ServiceUpdate } from "@/lib/services/types";

export interface ServiceFormState {
  error?: string;
  success?: boolean;
}

type ParsedServiceInput = Omit<ServiceInsert, "business_id">;

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Shared parsing + validation for both create and update. */
function parseServiceForm(formData: FormData): ParsedServiceInput | { error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const description = emptyToNull(String(formData.get("description") ?? ""));
  const durationRaw = String(formData.get("durationMinutes") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const isActive = formData.get("isActive") === "on";

  if (name.length < 2 || name.length > 100) {
    return { error: "Service name should be between 2 and 100 characters." };
  }
  if (description && description.length > 500) {
    return { error: "Description should be 500 characters or fewer." };
  }

  const durationMinutes = Number(durationRaw);
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0 || durationMinutes > 1440) {
    return { error: "Duration should be a number of minutes between 1 and 1440." };
  }

  const price = Number(priceRaw);
  if (!Number.isFinite(price) || price < 0) {
    return { error: "Price should be a valid, non-negative amount." };
  }

  return {
    name,
    description,
    duration_minutes: Math.round(durationMinutes),
    price: Math.round(price * 100) / 100,
    is_active: isActive,
  };
}

async function requireOwnerBusinessId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const business = await getBusinessForUser(user.id);
  if (!business) {
    redirect("/dashboard/onboarding");
  }

  return business.id;
}

export async function createService(
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  const businessId = await requireOwnerBusinessId();

  const parsed = parseServiceForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("services").insert({
    ...parsed,
    business_id: businessId,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/services");
  redirect("/dashboard/services");
}

export async function updateService(
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  const businessId = await requireOwnerBusinessId();
  const serviceId = String(formData.get("serviceId") ?? "");

  if (!serviceId) {
    return { error: "Missing service." };
  }

  const parsed = parseServiceForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const update: ServiceUpdate = parsed;

  const supabase = await createClient();
  const { error } = await (supabase as any)
    .from("services")
    .update(update)
    .eq("id", serviceId)
    .eq("business_id", businessId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/services");
  redirect("/dashboard/services");
}

export async function deleteService(serviceId: string): Promise<void> {
  const businessId = await requireOwnerBusinessId();

  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", serviceId)
    .eq("business_id", businessId);

  if (error) {
    console.error("Failed to delete service:", error.message);
  }

  revalidatePath("/dashboard/services");
}

export async function toggleServiceActive(
  serviceId: string,
  nextIsActive: boolean
): Promise<void> {
  const businessId = await requireOwnerBusinessId();

  const supabase = await createClient();
  const { error } = await (supabase as any)
    .from("services")
    .update({ is_active: nextIsActive })
    .eq("id", serviceId)
    .eq("business_id", businessId);

  if (error) {
    console.error("Failed to update service:", error.message);
  }

  revalidatePath("/dashboard/services");
}
