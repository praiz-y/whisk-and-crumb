import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryCard } from "@/components/products/CategoryCard";
import { Reveal } from "@/components/ui/Reveal";
import { getCategories } from "@/lib/data/categories";

export async function Categories() {
  const categories = await getCategories();

  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <Reveal>
          <SectionHeading eyebrow="Shop by Category" heading="Browse our treats" />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="no-scrollbar flex snap-x gap-6 overflow-x-auto pb-2 sm:justify-center sm:gap-10">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
