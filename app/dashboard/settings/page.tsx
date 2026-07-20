import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessForUser } from "@/lib/business/queries";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { BusinessForm } from "@/components/business/business-form";

export const metadata: Metadata = {
  title: "Business settings",
};

export default async function BusinessSettingsPage() {
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
        eyebrow="Business settings"
        title="Edit your business profile"
        subtitle="These details power your workspace and, soon, your public booking page."
      />

      <div className="mt-12 max-w-2xl">
        <GlassCard goldBorder>
          <BusinessForm mode="edit" business={business} />
        </GlassCard>
      </div>
    </>
  );
}
