import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ProductBrowser } from "@/components/products/ProductBrowser";
import { getProducts } from "@/lib/data/products";

export async function FeaturedProducts() {
  const products = await getProducts();
  const featured = products.filter((product) => product.featured).slice(0, 4);

  return (
    <section className="bg-cream-dark/40 py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <Reveal>
          <SectionHeading
            eyebrow="Customer Favorites"
            heading="Featured products"
            description="A few of the treats our customers keep coming back for."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ProductBrowser products={featured} />
        </Reveal>
        <Reveal delay={0.1} className="flex justify-center">
          <Button href="/products" variant="secondary">
            View All Products
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
