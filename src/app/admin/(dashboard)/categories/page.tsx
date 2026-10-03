import { getCategories } from "@/lib/data/categories";
import { getProducts } from "@/lib/data/products";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const productCounts = Object.fromEntries(
    categories.map((category) => [category.id, products.filter((p) => p.category === category.slug).length])
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-medium text-dark-text">Categories</h1>
      <CategoriesManager categories={categories} productCounts={productCounts} />
    </div>
  );
}
