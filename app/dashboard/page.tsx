import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getBusinessForUser } from "@/lib/business/queries";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { LogoPlaceholder } from "@/components/business/logo-placeholder";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const business = user ? await getBusinessForUser(user.id) : null;

  if (!business) {
    return (
      <>
        <SectionHeading
          eyebrow="Dashboard"
          title="Welcome to SolidW"
          subtitle="Set up your business profile to unlock your workspace — settings, and eventually your booking page, all live here."
        />

        <div className="mt-12">
          <EmptyState
            eyebrow="One step to go"
            title="You haven't set up your business yet"
            description="Tell us about your business — name, category, contact details and location — so we can build your workspace around it."
            action={
              <Button href="/dashboard/onboarding" size="lg">
                Set up your business
              </Button>
            }
          />
        </div>
      </>
    );
  }

  const location = [business.address, business.city, business.country]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <SectionHeading
        eyebrow="Dashboard"
        title={`Welcome back, ${business.name}`}
        subtitle="Here's a snapshot of your business profile. Head to Business Settings to make changes."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-start gap-5">
            <LogoPlaceholder name={business.name} logoUrl={business.logo_url} />
            <div className="min-w-0">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400/80">
                {business.category}
              </p>
              <h3 className="mt-2 truncate font-display text-2xl font-medium text-ivory-50">
                {business.name}
              </h3>
              {business.description && (
                <p className="mt-3 leading-relaxed text-ivory-200/75">
                  {business.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-6 border-t border-ivory-200/10 pt-6 sm:grid-cols-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ivory-200/50">
                Location
              </p>
              <p className="mt-2 text-ivory-100">{location || "Not set"}</p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ivory-200/50">
                Contact
              </p>
              {business.contact_email && (
                <p className="mt-2 break-all text-ivory-100">
                  {business.contact_email}
                </p>
              )}
              {business.contact_phone && (
                <p className="mt-1 text-ivory-100">{business.contact_phone}</p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <Button href="/dashboard/settings" variant="secondary">
              Edit business profile
            </Button>
          </div>
        </GlassCard>

        <GlassCard>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400/80">
            Account
          </p>
          <p className="mt-4 text-ivory-200/80">Signed in as</p>
          <p className="mt-1 break-all font-display text-xl text-ivory-50">
            {user?.email}
          </p>
        </GlassCard>
      </div>
    </>
  );
}
