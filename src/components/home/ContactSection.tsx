// src/components/home/ContactSection.tsx
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { InstagramIcon, FacebookIcon, TikTokIcon, XIcon } from "@/components/ui/SocialIcons";
import { getBusinessSettings } from "@/lib/data/business-settings";
import { buildWhatsAppChatUrl } from "@/lib/whatsapp";

export async function ContactSection() {
  const settings = await getBusinessSettings();
  const whatsappHref = buildWhatsAppChatUrl(settings.whatsappNumber);

  const socialLinks = [
    { key: "instagram", href: settings.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { key: "facebook", href: settings.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { key: "tiktok", href: settings.social.tiktok, label: "TikTok", Icon: TikTokIcon },
    { key: "x", href: settings.social.x, label: "X", Icon: XIcon },
  ].filter((social): social is typeof social & { href: string } => Boolean(social.href));

  return (
    <section className="bg-cream-dark/40 py-16 sm:py-20">
      <Container className="flex flex-col items-center gap-10 text-center">
        <Reveal>
          <SectionHeading
            eyebrow="Get in Touch"
            heading="Prefer to reach out directly?"
            description="WhatsApp is the fastest way to order, but we're happy to hear from you however works best."
          />
        </Reveal>

        <Reveal delay={0.05} className="flex flex-wrap items-center justify-center gap-4">
          {whatsappHref ? (
            <Button href={whatsappHref} variant="primary">
              Chat on WhatsApp
            </Button>
          ) : null}
          {settings.phone ? (
            <Button href={`tel:${settings.phone.replace(/\s+/g, "")}`} variant="secondary">
              <Phone aria-hidden="true" className="size-4" />
              Call Us
            </Button>
          ) : null}
          {settings.email ? (
            <Button href={`mailto:${settings.email}`} variant="secondary">
              <Mail aria-hidden="true" className="size-4" />
              Email Us
            </Button>
          ) : null}
        </Reveal>

        {settings.address ? (
          <Reveal delay={0.1}>
            <p className="flex items-center gap-2 text-sm text-brown">
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
              {settings.address}
            </p>
          </Reveal>
        ) : null}

        {settings.mapImageUrl ? (
          <Reveal delay={0.12}>
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border">
              <Image
                src={settings.mapImageUrl}
                alt="Satellite map of the area around our shop"
                width={600}
                height={400}
                className="h-auto w-full object-cover"
              />
            </div>
          </Reveal>
        ) : null}

        {socialLinks.length > 0 ? (
          <Reveal delay={0.15} className="flex items-center gap-3">
            {socialLinks.map(({ key, href, label, Icon }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-11 items-center justify-center rounded-full border border-border text-brown transition-colors duration-200 hover:border-caramel hover:text-caramel"
              >
                <Icon aria-hidden="true" className="size-5" />
              </a>
            ))}
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
