import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { GlassCard } from "@/components/ui/glass-card";
import { LogoPlaceholder } from "@/components/business/logo-placeholder";
import { BookingForm } from "@/components/booking/booking-form";
import { getBusinessBySlug } from "@/lib/business/queries";
import { getActiveServicesForBusiness } from "@/lib/services/queries";
import { formatDuration, formatPrice } from "@/lib/services/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    return { title: "Business not found" };
  }

  return {
    title: business.name,
    description:
      business.description ?? `Book with ${business.name} on SolidW.`,
  };
}

export default async function BusinessPublicPage({ params }: PageProps) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  const services = await getActiveServicesForBusiness(business.id);
  const location = [business.address, business.city, business.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="py-16 sm:py-24">
      <Container size="default">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <LogoPlaceholder name={business.name} logoUrl={business.logo_url} size="lg" />
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400/80">
              {business.category}
            </p>
            <h1 className="mt-2 font-display text-3xl font-medium leading-tight text-ivory-50 sm:text-4xl">
              {business.name}
            </h1>
            {location && (
              <p className="mt-2 text-ivory-200/70">{location}</p>
            )}
          </div>
        </div>

        {business.description && (
          <p className="mt-8 max-w-2xl leading-relaxed text-ivory-200/80">
            {business.description}
          </p>
        )}

        {(business.contact_email || business.contact_phone) && (
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm text-ivory-200/70">
            {business.contact_phone && <span>{business.contact_phone}</span>}
            {business.contact_email && (
              <span className="break-all">{business.contact_email}</span>
            )}
          </div>
        )}

        <div className="mt-16 grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-medium text-ivory-50">
              Services
            </h2>

            {services.length === 0 ? (
              <p className="mt-4 text-ivory-200/70">
                No services available yet — check back soon.
              </p>
            ) : (
              <div className="mt-6 flex flex-col gap-4">
                {services.map((service) => (
                  <GlassCard key={service.id} className="p-5 sm:p-6">
                    <h3 className="font-display text-lg font-medium text-ivory-50">
                      {service.name}
                    </h3>
                    {service.description && (
                      <p className="mt-2 text-sm leading-relaxed text-ivory-200/70">
                        {service.description}
                      </p>
                    )}
                    <p className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-gold-400/80">
                      {formatDuration(service.duration_minutes)} ·{" "}
                      {formatPrice(service.price)}
                    </p>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            <h2 className="font-display text-2xl font-medium text-ivory-50">
              Book an appointment
            </h2>
            <div className="mt-6">
              <BookingForm businessId={business.id} services={services} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
