import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { ProductBrowser } from "@/components/products/ProductBrowser";
import { getProducts } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our full range of cakes, cupcakes, snacks, small chops, and pastries.",
  alternates: {
    canonical: "/products",
  },
};

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const isValidCategory = categories.some((c) => c.slug === category);
  const filtered = isValidCategory ? products.filter((product) => product.category === category) : products;

  return (
    <div className="flex flex-1 flex-col gap-10 py-16 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Our Menu"
            heading="Something for every craving."
            description="Explore our selection of freshly prepared cakes, sweet treats, snacks, and small chops."
          />
        </Reveal>
      </Container>

      <Container>
        <Reveal delay={0.05}>
          <CategoryFilter categories={categories} activeSlug={category} />
        </Reveal>
      </Container>

      <Container>
        <Reveal delay={0.1}>
          <ProductBrowser products={filtered} emptyState={<ProductsEmptyState />} />
        </Reveal>
      </Container>
    </div>
  );
}

function ProductsEmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="font-display text-xl text-dark-text">Nothing here just yet.</p>
      <p className="text-brown">We&rsquo;re preparing something delicious.</p>
      <Button href="/products" variant="secondary">
        View All Treats
      </Button>
    </div>
  );
}
