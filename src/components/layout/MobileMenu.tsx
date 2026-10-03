"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { navLinks } from "@/components/layout/nav-links";
import { businessConfig } from "@/config/business";
import { buildWhatsAppChatUrl } from "@/lib/whatsapp";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
}

export function MobileMenu({ isOpen, onClose, whatsappNumber }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const whatsappHref = buildWhatsAppChatUrl(whatsappNumber);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    focusable?.[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-50 flex flex-col bg-cream"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between px-5 py-5">
            <span className="font-display text-lg font-semibold text-dark-text">
              {businessConfig.name}
            </span>
            <IconButton aria-label="Close menu" onClick={onClose}>
              <X aria-hidden="true" className="size-5" />
            </IconButton>
          </div>

          <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-2 px-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="min-h-11 py-3 font-display text-3xl font-medium text-dark-text transition-colors duration-200 hover:text-caramel"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="px-8 pb-10">
            <Button
              type="button"
              href={whatsappHref ?? undefined}
              disabled={!whatsappHref}
              variant="primary"
              className="w-full"
            >
              Order on WhatsApp
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
