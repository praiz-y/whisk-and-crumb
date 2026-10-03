import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="flex flex-col items-start gap-6 text-left">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-brown">
            Freshly Baked, Always
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] text-dark-text sm:text-5xl lg:text-[56px]">
            Cakes and treats worth slowing down for.
          </h1>
          <p className="max-w-md text-base text-brown sm:text-lg">
            Custom cakes, cupcakes, and everyday bakes made fresh to order — crafted with care,
            finished by hand.
          </p>
          <Button href="/products" variant="primary">
            Explore Our Treats
          </Button>
        </Reveal>

        <Reveal delay={0.1} className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-6 -z-10 rounded-[40%] bg-caramel/15 blur-3xl"
          />
          <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl">
            <Image
              src="/images/hero/hero-main.png"
              alt="A beautifully finished layered cake, one of our signature bakes"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
