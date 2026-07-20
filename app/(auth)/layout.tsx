import { Container } from "@/components/ui/container";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/3 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-gold-400/10 blur-3xl"
      />
      <Container size="narrow" className="relative z-10">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </Container>
    </div>
  );
}
