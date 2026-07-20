import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessForUser } from "@/lib/business/queries";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceForm } from "@/components/business/service-form";

export const metadata: Metadata = {
  title: "Add a service",
};

export default async function NewServicePage() {
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

  return (
    <>
      <SectionHeading
        eyebrow="Services"
        title="Add a service"
        subtitle="Give it a clear name, duration and price — customers will see exactly this on your booking page."
      />

      <div className="mt-12 max-w-2xl">
        <GlassCard goldBorder>
          <ServiceForm mode="create" />
        </GlassCard>
      </div>
    </>
  );
}
