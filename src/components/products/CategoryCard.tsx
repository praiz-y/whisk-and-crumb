import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/category";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group flex w-24 shrink-0 snap-start flex-col items-center gap-3 sm:w-28 focus-visible:outline-none"
    >
      <span className="relative block size-24 overflow-hidden rounded-full border border-border transition-shadow duration-200 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-caramel sm:size-28">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(min-width: 640px) 112px, 96px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </span>
      <span className="text-sm font-medium text-dark-text">{category.name}</span>
    </Link>
  );
}
