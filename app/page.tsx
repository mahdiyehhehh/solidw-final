import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    label: "01",
    title: "Share your page",
    body: "Customers browse your services and pick a time on a page that carries your name and your colors — never ours.",
  },
  {
    label: "02",
    title: "They message you",
    body: "Every booking request lands directly in your WhatsApp or Telegram, exactly where you already work.",
  },
  {
    label: "03",
    title: "You stay in control",
    body: "No payment processors, no commission taken from your bookings. You confirm, reschedule, or decline — your way.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[92vh] items-center overflow-hidden pt-24">
        <Container size="wide" className="relative z-10">
          <div className="max-w-3xl">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-gold-400/80">
              Booking, made yours
            </p>
            <h1 className="font-display text-5xl font-medium leading-[1.05] text-ivory-50 sm:text-6xl lg:text-7xl">
              A booking page your clients will swear you built in-house.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ivory-200/80 sm:text-xl">
              SolidW gives your business a fully branded booking website.
              Customers reserve through WhatsApp or Telegram — no payment
              gateways inside the page, no name on it but yours.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="#how-it-works" size="lg">
                See how it works
              </Button>
              <Button href="#features" variant="secondary" size="lg">
                Built for businesses
              </Button>
            </div>
          </div>
        </Container>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-gold-400/10 blur-3xl"
        />
      </section>

      <section id="how-it-works" className="relative py-28 sm:py-36">
        <Container size="wide">
          <SectionHeading
            eyebrow="How it works"
            title="Three steps. Zero platforms in the way."
            subtitle="SolidW sits quietly behind the page. What your customers see, and what you receive, is entirely between the two of you."
          />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <GlassCard key={step.label} delay={i * 0.1}>
                <span className="font-mono text-sm text-gold-400/70">
                  {step.label}
                </span>
                <h3 className="mt-4 font-display text-2xl font-medium text-ivory-50">
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-ivory-200/75">
                  {step.body}
                </p>
              </GlassCard>
            ))}
          </div>
        </Container>
      </section>

      <section id="features" className="relative py-28 sm:py-36">
        <Container size="default">
          <GlassCard goldBorder className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400/80">
              Entirely yours
            </p>
            <h2 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-medium leading-tight text-ivory-50 sm:text-4xl">
              Every booking page belongs to the business. We never put our
              name on it.
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ivory-200/75">
              Upgrading to Pro is a conversation, not a checkout — handled
              manually over Telegram, settled in USDT, on your schedule.
            </p>
          </GlassCard>
        </Container>
      </section>

      <footer className="border-t border-ivory-200/10 py-10">
        <Container size="wide">
          <p className="text-center font-display text-lg tracking-wide text-ivory-200/60">
            SolidW
          </p>
        </Container>
      </footer>
    </>
  );
}
