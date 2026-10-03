"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconButton } from "@/components/ui/IconButton";
import { Reveal } from "@/components/ui/Reveal";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  const showPrev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const showNext = () => setIndex((i) => (i + 1) % testimonials.length);

  if (!current) return null;

  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col items-center gap-10">
        <Reveal>
          <SectionHeading eyebrow="Testimonials" heading="What people are saying" />
        </Reveal>

        <Reveal delay={0.05} className="flex w-full max-w-2xl flex-col items-center gap-6">
          <Quote aria-hidden="true" className="size-8 text-caramel" />

          <div className="min-h-[140px] w-full text-center" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex flex-col items-center gap-4"
              >
                <p className="font-display text-xl leading-relaxed text-dark-text sm:text-2xl">
                  &ldquo;{current.quote}&rdquo;
                </p>
                <p className="text-sm font-medium text-brown">
                  {current.name}
                  {current.role ? <span className="text-brown/70"> — {current.role}</span> : null}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {testimonials.length > 1 ? (
            <div className="flex items-center gap-4">
              <IconButton aria-label="Previous testimonial" onClick={showPrev}>
                <ChevronLeft aria-hidden="true" className="size-5" />
              </IconButton>
              <div className="flex gap-1.5" role="tablist" aria-label="Select testimonial">
                {testimonials.map((testimonial, i) => (
                  <button
                    key={testimonial.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Show testimonial from ${testimonial.name}`}
                    onClick={() => setIndex(i)}
                    className={`size-2 rounded-full transition-colors duration-200 ${
                      i === index ? "bg-caramel" : "bg-border"
                    }`}
                  />
                ))}
              </div>
              <IconButton aria-label="Next testimonial" onClick={showNext}>
                <ChevronRight aria-hidden="true" className="size-5" />
              </IconButton>
            </div>
          ) : null}
        </Reveal>
      </Container>
    </section>
  );
}
