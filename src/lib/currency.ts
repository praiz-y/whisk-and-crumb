import { businessConfig } from "@/config/business";

export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return `${businessConfig.currencySymbol}${formatted}`;
}
