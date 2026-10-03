"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { CartButton } from "@/components/cart/CartButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { navLinks } from "@/components/layout/nav-links";
import { businessConfig } from "@/config/business";
import { cn } from "@/lib/utils";
import { buildWhatsAppChatUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

interface NavbarProps {
  products: Product[];
  whatsappNumber: string;
}

export function Navbar({ products, whatsappNumber }: NavbarProps) {
  const [isCondensed, setIsCondensed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const whatsappHref = buildWhatsAppChatUrl(whatsappNumber);

  useEffect(() => {
    const handleScroll = () => setIsCondensed(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-cream/95 backdrop-blur">
        <Container>
          <div
            className={cn(
              "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-4 transition-[padding] duration-300 ease-out",
              isCondensed ? "py-3" : "py-5"
            )}
          >
            <div className="flex items-center gap-6">
              <IconButton
                aria-label="Open menu"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu aria-hidden="true" className="size-5" />
              </IconButton>
              <nav aria-label="Primary" className="hidden lg:flex lg:items-center lg:gap-6">
                {navLinks.slice(0, 2).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[15px] font-medium whitespace-nowrap text-brown transition-colors duration-200 hover:text-dark-text"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <Link
              href="/"
              className={cn(
                "font-display font-semibold text-dark-text transition-[font-size] duration-300 ease-out whitespace-nowrap",
                isCondensed ? "text-lg" : "text-xl"
              )}
            >
              {businessConfig.name}
            </Link>

            <div className="flex items-center justify-end gap-2 lg:gap-3">
              <Link
                href="/products"
                className="hidden text-[15px] font-medium whitespace-nowrap text-brown transition-colors duration-200 hover:text-dark-text lg:block"
              >
                Products
              </Link>
              <CartButton products={products} onClick={() => setIsCartOpen(true)} />
              <Button
                type="button"
                href={whatsappHref ?? undefined}
                disabled={!whatsappHref}
                variant="primary"
                className="hidden px-5 lg:inline-flex"
              >
                Order on WhatsApp
              </Button>
            </div>
          </div>
        </Container>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        whatsappNumber={whatsappNumber}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        products={products}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
}
