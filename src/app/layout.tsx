import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/lib/settings";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const SITE_URL = "https://realestateintelligence.vercel.app";
const SITE_DESC =
  "Live student-housing acquisitions scoring and new-construction development intelligence in one workspace, built on 100% live public data.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Real Estate Intelligence",
  description: SITE_DESC,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Real Estate Intelligence",
    title: "Real Estate Intelligence",
    description: SITE_DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Estate Intelligence",
    description: SITE_DESC,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}>
      <body>
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}
