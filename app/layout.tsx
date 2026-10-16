import { connection } from "next/server";
import StructuredData from "@/components/StructuredData";
import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InfinotechAI from "@/components/InfinotechAI";
import { site } from "@/lib/site";
import "./globals.css";
const description =
  "Infinotech builds websites, custom software, mobile applications and practical AI solutions for businesses worldwide.";
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Infinotech | Web, Software & AI Solutions",
    template: "%s | Infinotech",
  },
  description,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Infinotech | Web, Software & AI Solutions",
    description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Infinotech — Infinite ideas. Engineered into reality.",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/og-image.png"] },
  icons: { icon: "/favicon.ico", apple: "/apple-icon.png" },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.name,
            url: site.url,
            logo: `${site.url}/logo/infinotech-logo.png`,
            telephone: site.phone,
            email: site.email,
          }}
        />
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <InfinotechAI />
      </body>
    </html>
  );
}
