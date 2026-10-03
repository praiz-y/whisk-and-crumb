import { Compass, MessageCircle, ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const steps = [
  {
    number: "01",
    title: "Browse",
    description: "Explore our cakes, cupcakes, snacks, and pastries.",
    icon: Compass,
  },
  {
    number: "02",
    title: "Add to Cart",
    description: "Pick your favorites and set the quantities you need.",
    icon: ShoppingBag,
  },
  {
    number: "03",
    title: "Continue to WhatsApp",
    description: "Send your order to us directly and we'll confirm the details.",
    icon: MessageCircle,
  },
];

export function OrderingProcess() {
  return (
    <section className="bg-cream-dark/40 py-16 sm:py-20">
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="How It Works"
            heading="Ordering is simple"
            description="From browsing to checkout, your order reaches us in three easy steps."
          />
        </Reveal>

        <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.07} className="flex flex-col items-center gap-4 text-center">
              <div className="relative flex size-16 items-center justify-center rounded-full bg-cream text-brown ring-1 ring-border">
                <step.icon aria-hidden="true" className="size-6" />
                <span className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-caramel text-xs font-semibold text-cream">
                  {step.number}
                </span>
              </div>
              <h3 className="font-display text-lg font-medium text-dark-text">{step.title}</h3>
              <p className="max-w-[220px] text-sm text-brown">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
