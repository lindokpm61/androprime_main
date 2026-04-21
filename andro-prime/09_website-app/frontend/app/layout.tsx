import type { Metadata, Viewport } from "next";
import "@/styles/base/globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

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
    <html lang="en" className="scroll-smooth">
      <body className="bg-white text-black antialiased overflow-x-hidden selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
