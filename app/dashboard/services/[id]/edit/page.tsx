import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessForUser } from "@/lib/business/queries";
import { getServiceForOwner } from "@/lib/services/queries";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceForm } from "@/components/business/service-form";

export const metadata: Metadata = {
  title: "Edit service",
};

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

  const service = await getServiceForOwner(id, business.id);
  if (!service) {
    notFound();
  }

  return (
    <>
      <SectionHeading
        eyebrow="Services"
        title="Edit service"
        subtitle="Changes apply immediately to your public booking page."
      />

      <div className="mt-12 max-w-2xl">
        <GlassCard goldBorder>
          <ServiceForm mode="edit" service={service} />
        </GlassCard>
      </div>
    </>
  );
}
