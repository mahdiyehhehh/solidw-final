import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessForUser } from "@/lib/business/queries";
import { getServicesForOwner } from "@/lib/services/queries";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { ServiceRow } from "@/components/business/service-row";

export const metadata: Metadata = {
  title: "Services",
};

export default async function ServicesPage() {
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

  const services = await getServicesForOwner(business.id);

  return (
    <>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Services"
          title="What customers can book"
          subtitle="Add the services you offer — name, duration and price. Active services appear on your public booking page."
        />
        <Button href="/dashboard/services/new" size="lg" className="shrink-0">
          Add service
        </Button>
      </div>

      <div className="mt-12">
        {services.length === 0 ? (
          <EmptyState
            eyebrow="No services yet"
            title="Add your first bookable service"
            description="Customers can only book services you've added here. Start with your most popular offering."
            action={
              <Button href="/dashboard/services/new" size="lg">
                Add service
              </Button>
            }
          />
        ) : (
          <GlassCard>
            {services.map((service) => (
              <ServiceRow key={service.id} service={service} />
            ))}
          </GlassCard>
        )}
      </div>

      <p className="mt-6 text-sm text-ivory-400/60">
        Your public booking page is at{" "}
        <span className="text-ivory-200">/{business.slug}</span>
      </p>
    </>
  );
}
