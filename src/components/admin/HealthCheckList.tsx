interface HealthCheckListProps {
  categoriesWithNoProducts: number;
  productsWithNoPhoto: number;
}

export function HealthCheckList({ categoriesWithNoProducts, productsWithNoPhoto }: HealthCheckListProps) {
  if (categoriesWithNoProducts === 0 && productsWithNoPhoto === 0) return null;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-error/30 bg-error/5 p-5">
      <p className="text-sm font-medium text-dark-text">Needs attention</p>
      <ul className="flex flex-col gap-1 text-sm text-brown">
        {categoriesWithNoProducts > 0 ? (
          <li>{categoriesWithNoProducts} categor{categoriesWithNoProducts === 1 ? "y has" : "ies have"} no products</li>
        ) : null}
        {productsWithNoPhoto > 0 ? (
          <li>{productsWithNoPhoto} product{productsWithNoPhoto === 1 ? "" : "s"} missing a photo</li>
        ) : null}
      </ul>
    </div>
  );
}
