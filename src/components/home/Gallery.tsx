"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconButton } from "@/components/ui/IconButton";
import { Reveal } from "@/components/ui/Reveal";
import type { GalleryImage } from "@/types/content";

interface GalleryProps {
  images: GalleryImage[];
}

export function Gallery({ images }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = () => setActiveIndex(null);
  const showPrev = () =>
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + images.length) % images.length
    );
  const showNext = () =>
    setActiveIndex((current) => (current === null ? null : (current + 1) % images.length));

  useEffect(() => {
    if (activeIndex === null) return;

    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex]);

  const activeImage = activeIndex === null ? null : images[activeIndex];

  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <Reveal>
          <SectionHeading eyebrow="Gallery" heading="A closer look" />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="columns-2 gap-4 lg:columns-3">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
              >
                <Image
                  src={image.image}
                  alt={image.alt}
                  width={600}
                  height={750}
                  className="h-auto w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              </button>
            ))}
          </div>
        </Reveal>
      </Container>

      <AnimatePresence>
        {activeImage ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={activeImage.alt}
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark-text/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => {
              if (event.target === event.currentTarget) close();
            }}
          >
            <div className="relative max-h-[85vh] max-w-3xl">
              <Image
                src={activeImage.image}
                alt={activeImage.alt}
                width={1000}
                height={1250}
                className="max-h-[85vh] w-auto rounded-2xl object-contain"
              />
              <IconButton
                ref={closeButtonRef}
                aria-label="Close image viewer"
                onClick={close}
                className="absolute -top-3 -right-3 bg-cream shadow-md"
              >
                <X aria-hidden="true" className="size-5" />
              </IconButton>
              <IconButton
                aria-label="Previous image"
                onClick={showPrev}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-cream/90 shadow-md"
              >
                <ChevronLeft aria-hidden="true" className="size-5" />
              </IconButton>
              <IconButton
                aria-label="Next image"
                onClick={showNext}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-cream/90 shadow-md"
              >
                <ChevronRight aria-hidden="true" className="size-5" />
              </IconButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
