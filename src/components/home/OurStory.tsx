import Image from "next/image";
import { Leaf, Heart, Clock, Gift } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { businessConfig } from "@/config/business";

const trustPoints = [
  { icon: Leaf, label: "Quality ingredients" },
  { icon: Heart, label: "Made with care" },
  { icon: Clock, label: "Freshly prepared" },
  { icon: Gift, label: "Perfect for every occasion" },
];

export function OurStory() {
  return (
    <section id="our-story" className="scroll-mt-24 py-16 sm:py-20">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative aspect-4/5 overflow-hidden rounded-3xl lg:order-2">
          <Image
            src="/images/gallery/gallery-04.png"
            alt="Close-up of a freshly sliced cake, showing the care in every layer"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>

        <Reveal delay={0.05} className="flex flex-col gap-6 lg:order-1">
          <SectionHeading
            align="left"
            eyebrow="Our Story"
            heading={`Why ${businessConfig.name}`}
          />
          <p className="max-w-lg text-base leading-relaxed text-brown">
            {businessConfig.name} started as a small kitchen project driven by one simple idea:
            baked goods should feel like they were made for you, not mass-produced. Every order is
            still prepared in small batches, by hand, with the same care as the very first cake we
            ever sold. This is placeholder founder copy — swap it for the real story when ready.
          </p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
            {trustPoints.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cream-dark text-brown">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <span className="text-sm font-medium text-dark-text">{label}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
