// src/components/layout/Footer.tsx
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { InstagramIcon, FacebookIcon, TikTokIcon, XIcon } from "@/components/ui/SocialIcons";
import { navLinks } from "@/components/layout/nav-links";
import { businessConfig } from "@/config/business";
import { getBusinessSettings } from "@/lib/data/business-settings";
import { buildWhatsAppChatUrl } from "@/lib/whatsapp";

export async function Footer() {
  const year = new Date().getFullYear();
  const settings = await getBusinessSettings();
  const whatsappHref = buildWhatsAppChatUrl(settings.whatsappNumber);

  const socialLinks = [
    { key: "instagram", href: settings.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { key: "facebook", href: settings.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { key: "tiktok", href: settings.social.tiktok, label: "TikTok", Icon: TikTokIcon },
    { key: "x", href: settings.social.x, label: "X", Icon: XIcon },
  ].filter((social): social is typeof social & { href: string } => Boolean(social.href));

  return (
    <footer className="bg-brown text-cream">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
          <span className="font-display text-xl font-semibold">{businessConfig.name}</span>
          <p className="max-w-sm text-sm leading-relaxed text-cream/80">
            {businessConfig.description}
          </p>
        </div>

        <nav aria-label="Footer" className="flex min-w-0 flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-cream/60">Navigate</p>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-cream/85 transition-colors duration-200 hover:text-caramel"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex min-w-0 flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-cream/60">Contact</p>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-cream/85 transition-colors duration-200 hover:text-caramel"
            >
              <MessageCircle aria-hidden="true" className="size-4 shrink-0" />
              WhatsApp
            </a>
          ) : null}
          {settings.phone ? (
            <a
              href={`tel:${settings.phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-2 text-sm text-cream/85 transition-colors duration-200 hover:text-caramel"
            >
              <Phone aria-hidden="true" className="size-4 shrink-0" />
              {settings.phone}
            </a>
          ) : null}
          {settings.email ? (
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-2 text-sm text-cream/85 transition-colors duration-200 hover:text-caramel"
            >
              <Mail aria-hidden="true" className="size-4 shrink-0" />
              <span className="break-all">{settings.email}</span>
            </a>
          ) : null}
          {settings.address ? (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-cream/85 transition-colors duration-200 hover:text-caramel"
            >
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
              {settings.address}
            </a>
          ) : null}

          {socialLinks.length > 0 ? (
            <div className="mt-2 flex items-center gap-3">
              {socialLinks.map(({ key, href, label, Icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-cream/25 transition-colors duration-200 hover:border-caramel hover:text-caramel"
                >
                  <Icon aria-hidden="true" className="size-4" />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </Container>

      <div className="border-t border-cream/15">
        <Container className="flex flex-col items-center gap-2 py-6 text-xs text-cream/60 sm:flex-row sm:justify-between">
          <span>
            © {year} {businessConfig.name}. All rights reserved.
          </span>
        </Container>
      </div>
    </footer>
  );
}
