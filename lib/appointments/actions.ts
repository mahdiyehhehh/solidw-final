"use server";

import { createClient } from "@/lib/supabase/server";

export interface BookingFormState {
  error?: string;
  success?: boolean;
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}(:\d{2})?$/;

/**
 * Submits a booking request from a business's public page. No account is
 * required — RLS's "Anyone can submit a booking" policy allows the
 * insert as long as the chosen service is real, active, and belongs to
 * the business being booked (also re-checked here for a friendlier
 * error message than a raw RLS rejection).
 */
export async function createAppointment(
  _prevState: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const businessId = String(formData.get("businessId") ?? "").trim();
  const serviceId = String(formData.get("serviceId") ?? "").trim();
  const customerName = String(formData.get("customerName") ?? "").trim();
  const customerPhone = String(formData.get("customerPhone") ?? "").trim();
  const customerEmail = emptyToNull(String(formData.get("customerEmail") ?? ""));
  const notes = emptyToNull(String(formData.get("notes") ?? ""));
  const appointmentDate = String(formData.get("appointmentDate") ?? "").trim();
  const appointmentTime = String(formData.get("appointmentTime") ?? "").trim();

  if (!businessId || !serviceId) {
    return { error: "Choose a service before booking." };
  }
  if (customerName.length < 2 || customerName.length > 100) {
    return { error: "Enter your name." };
  }
  if (customerPhone.length < 5 || customerPhone.length > 30) {
    return { error: "Enter a valid phone number." };
  }
  if (customerEmail && !isValidEmail(customerEmail)) {
    return { error: "Enter a valid email, or leave it blank." };
  }
  if (notes && notes.length > 500) {
    return { error: "Notes should be 500 characters or fewer." };
  }
  if (!DATE_RE.test(appointmentDate)) {
    return { error: "Choose a date." };
  }
  if (!TIME_RE.test(appointmentTime)) {
    return { error: "Choose a time." };
  }

  const requestedAt = new Date(`${appointmentDate}T${appointmentTime}`);
  if (Number.isNaN(requestedAt.getTime())) {
    return { error: "That date and time aren't valid." };
  }
  if (requestedAt.getTime() < Date.now() - 60_000) {
    return { error: "Choose a date and time in the future." };
  }

  const supabase = await createClient();

  // Re-verify the service belongs to this business and is bookable, so
  // a mismatched businessId/serviceId pair fails with a clear message
  // instead of a generic RLS error.
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .maybeSingle()as {data: any; error: any };

  if (serviceError || !service || service.business_id !== businessId || !service.is_active) {
    return { error: "That service is no longer available. Please choose another." };
  }

  const { error } = await supabase.from("appointments").insert({
    business_id: businessId,
    service_id: serviceId,
    customer_name: customerName,
    customer_phone: customerPhone,
    customer_email: customerEmail,
    notes,
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
} as any);

  if (error) {
    return { error: "Something went wrong submitting your booking. Please try again." };
  }

  return { success: true };
}
