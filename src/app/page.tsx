import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { OurStory } from "@/components/home/OurStory";
import { Gallery } from "@/components/home/Gallery";
import { Testimonials } from "@/components/home/Testimonials";
import { OrderingProcess } from "@/components/home/OrderingProcess";
import { FAQSection } from "@/components/home/FAQSection";
import { ContactSection } from "@/components/home/ContactSection";
import { getGalleryImages } from "@/lib/data/gallery";

export const metadata: Metadata = {
  title: "Whisk & Crumb — Custom Cakes & Baked Treats",
  description:
    "Custom cakes, cupcakes, snacks, small chops, and pastries made fresh to order. Browse our menu and order directly on WhatsApp.",
  openGraph: {
    images: ["/images/hero/hero-main.png"],
  },
};

export default async function Home() {
  const galleryImages = await getGalleryImages();

  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <OurStory />
      <Gallery images={galleryImages} />
      <Testimonials />
      <OrderingProcess />
      <FAQSection />
      <ContactSection />
    </>
  );
}
