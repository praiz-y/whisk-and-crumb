import { getProducts } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import { getGalleryImages } from "@/lib/data/gallery";
import { HealthCheckList } from "@/components/admin/HealthCheckList";

export default async function AdminDashboardPage() {
  const [products, categories, galleryImages] = await Promise.all([
    getProducts(),
    getCategories(),
    getGalleryImages(),
  ]);

  const categoriesWithNoProducts = categories.filter(
    (category) => !products.some((product) => product.category === category.slug)
  ).length;
  const productsWithNoPhoto = products.filter((product) => !product.image).length;

  const stats = [
    { label: "Products", value: products.length },
    { label: "Categories", value: categories.length },
    { label: "Gallery images", value: galleryImages.length },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-medium text-dark-text">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-white p-5">
            <p className="text-sm text-brown">{label}</p>
            <p className="font-display text-3xl font-medium text-dark-text">{value}</p>
          </div>
        ))}
      </div>
      <HealthCheckList
        categoriesWithNoProducts={categoriesWithNoProducts}
        productsWithNoPhoto={productsWithNoPhoto}
      />
    </div>
  );
}
