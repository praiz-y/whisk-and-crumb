import { getProducts } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import { ProductsManager } from "@/components/admin/ProductsManager";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-medium text-dark-text">Products</h1>
      <ProductsManager products={products} categories={categories} />
    </div>
  );
}
