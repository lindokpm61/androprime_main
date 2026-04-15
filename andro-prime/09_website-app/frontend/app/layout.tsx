import type { Metadata } from "next";
import { Inter, Merriweather, JetBrains_Mono } from "next/font/google";
import "@/styles/base/globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  variable: "--font-merriweather",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Andro Prime | Premium At-Home Blood Tests for Men",
    template: "%s | Andro Prime",
  },
  description:
    "At-home blood tests that tell you exactly what your levels are. No GP needed. UKAS ISO 15189 accredited lab.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://androprime.co.uk"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${inter.variable} ${merriweather.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-white text-black antialiased">{children}</body>
    </html>
  );
}
