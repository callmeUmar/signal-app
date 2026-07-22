import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://signal.audio"),
  title: "Signal — Turn your MIDI into the next idea",
  description: "A personal MIDI copilot for FL Studio. Compare controlled continuations and variations, then keep editing every note.",
  applicationName: "Signal",
  keywords: ["MIDI copilot", "FL Studio", "Piano Roll", "music production", "MIDI variation"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Signal — The MIDI copilot that keeps your idea editable",
    description: "Start with your motif. Compare four controlled directions. Keep the authorship.",
    url: "/",
    siteName: "Signal",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Signal MIDI copilot" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Signal — Turn your MIDI into the next idea",
    description: "Controlled, editable MIDI directions for FL Studio producers.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070907",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
