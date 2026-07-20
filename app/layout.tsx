import type { Metadata, Viewport } from "next";
import { fontDisplay, fontSans, fontMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://solidw.com"),
  title: {
    default: "SolidW — Booking Websites for Businesses That Book Through Chat",
    template: "%s — SolidW",
  },
  description:
    "SolidW gives your business its own booking website. Customers reserve through WhatsApp or Telegram — no payment gateways, no platform branding, entirely yours.",
  keywords: [
    "booking website",
    "WhatsApp booking",
    "Telegram booking",
    "appointment scheduling software",
    "SolidW",
  ],
  openGraph: {
    title: "SolidW — Booking Websites for Businesses That Book Through Chat",
    description:
      "Create a booking website customers reserve through WhatsApp or Telegram. No payments inside the page, no branding — entirely yours.",
    url: "https://solidw.com",
    siteName: "SolidW",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SolidW — Booking Websites for Businesses That Book Through Chat",
    description:
      "Create a booking website customers reserve through WhatsApp or Telegram.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#2b0509",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`}
    >
      <body className="bg-mesh-crimson bg-noise min-h-screen font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:rounded-xl focus:bg-gold-400 focus:px-4 focus:py-2 focus:font-medium focus:text-crimson-950"
        >
          Skip to content
        </a>
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
