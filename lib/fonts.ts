import { Fraunces, Manrope, JetBrains_Mono } from "next/font/google";

/**
 * Display face — used for headlines only. Fraunces is a soft, editorial
 * serif with a wide optical-size axis, which is what gives SolidW's
 * headlines their handcrafted, slightly-italic-leaning character at
 * large sizes without needing a licensed luxury typeface.
 */
export const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

/**
 * Body face — used for all UI copy, paragraphs and interface labels.
 * Manrope is a geometric grotesk with a slightly rounded terminal,
 * legible at small sizes and warmer than a neutral system sans.
 */
export const fontSans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/**
 * Utility face — reserved for eyebrows, labels, prices, booking codes
 * and other data-like fragments. Never used for prose.
 */
export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
  display: "swap",
});
