import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessForUser } from "@/lib/business/queries";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { BusinessForm } from "@/components/business/business-form";

export const metadata: Metadata = {
  title: "Set up your business",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Already onboarded — send them to settings instead of letting a
  // second business row get created.
  const business = await getBusinessForUser(user.id);
  if (business) {
    redirect("/dashboard");
  }

  return (
    <>
      <SectionHeading
        eyebrow="Get started"
        title="Set up your business"
        subtitle="This becomes the foundation of your workspace — you can update it anytime from Business Settings."
      />

      <div className="mt-12 max-w-2xl">
        <GlassCard goldBorder>
          <BusinessForm mode="create" />
        </GlassCard>
      </div>
    </>
  );
}
