import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ConditionalChrome } from "@/components/layout/ConditionalChrome";
import { businessConfig } from "@/config/business";
import { getBusinessSettings } from "@/lib/data/business-settings";
import { getProducts } from "@/lib/data/products";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(businessConfig.siteUrl),
  title: {
    default: `${businessConfig.name} — ${businessConfig.tagline}`,
    template: `%s | ${businessConfig.name}`,
  },
  description: businessConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: businessConfig.name,
    description: businessConfig.description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: businessConfig.name,
    description: businessConfig.description,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, products] = await Promise.all([getBusinessSettings(), getProducts()]);

  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: businessConfig.name,
    description: businessConfig.description,
    url: businessConfig.siteUrl,
    telephone: settings.phone,
    email: settings.email,
    address: settings.address,
    image: `${businessConfig.siteUrl}/images/hero/hero-main.png`,
    sameAs: Object.values(settings.social).filter(Boolean),
  };

  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-dark-text font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd).replace(/</g, "\\u003c") }}
        />
        <MotionConfig reducedMotion="user">
          <ConditionalChrome
            navbar={<Navbar products={products} whatsappNumber={settings.whatsappNumber} />}
            footer={<Footer />}
          >
            {children}
          </ConditionalChrome>
        </MotionConfig>
      </body>
    </html>
  );
}
