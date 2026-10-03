import Link from "next/link";
import type { Category } from "@/types/category";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Category[];
  activeSlug?: string;
}

/**
 * Server-rendered on purpose: plain <Link>s already make the URL the source
 * of truth for the selected category, so no client JS is needed to filter —
 * simpler than the client "router.push on click" approach Phase 3 assumed.
 */
export function CategoryFilter({ categories, activeSlug }: CategoryFilterProps) {
  const isAllActive = !categories.some((category) => category.slug === activeSlug);

  return (
    <nav
      aria-label="Filter products by category"
      className="no-scrollbar flex gap-6 overflow-x-auto border-b border-border sm:justify-center"
    >
      <FilterLink href="/products" label="All" isActive={isAllActive} />
      {categories.map((category) => (
        <FilterLink
          key={category.id}
          href={`/products?category=${category.slug}`}
          label={category.name}
          isActive={category.slug === activeSlug}
        />
      ))}
    </nav>
  );
}

function FilterLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex min-h-11 shrink-0 items-center border-b-2 px-1 text-sm font-medium whitespace-nowrap transition-colors duration-200",
        isActive ? "border-caramel text-dark-text" : "border-transparent text-brown hover:text-dark-text"
      )}
    >
      {label}
    </Link>
  );
}
