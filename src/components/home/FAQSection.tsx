import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { faqs } from "@/data/faqs";

export function FAQSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col items-center gap-10">
        <Reveal>
          <SectionHeading eyebrow="FAQ" heading="Common questions" />
        </Reveal>
        <Reveal delay={0.05} className="w-full max-w-2xl">
          <Accordion items={faqs} />
        </Reveal>
      </Container>
    </section>
  );
}
