import { businessConfig } from "@/config/business";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/currency";
import { getCartSubtotal } from "@/lib/cart-totals";

// wa.me requires digits only (country code + number, no leading +).
export function isValidWhatsAppNumber(number: string): boolean {
  return /^\d{7,15}$/.test(number);
}

/**
 * Returns null when the configured WhatsApp number isn't valid, so callers
 * can hide/disable the chat link instead of linking to a broken wa.me URL.
 */
export function buildWhatsAppChatUrl(whatsappNumber: string): string | null {
  return isValidWhatsAppNumber(whatsappNumber) ? `https://wa.me/${whatsappNumber}` : null;
}

/**
 * Returns null when checkout isn't safely possible — an empty/unresolvable
 * cart or a misconfigured business number — so the caller can disable the
 * checkout action instead of sending a broken or empty order.
 */
export function buildWhatsAppOrderUrl(
  items: CartItem[],
  products: Product[],
  whatsappNumber: string
): string | null {
  if (!isValidWhatsAppNumber(whatsappNumber)) return null;

  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return `• ${product.name} × ${item.quantity} — ${formatCurrency(product.price * item.quantity)}`;
    })
    .filter((line): line is string => line !== null);

  if (lines.length === 0) return null;

  const total = formatCurrency(getCartSubtotal(items, products));

  const message = [
    `Hello ${businessConfig.name},`,
    "",
    "I'd like to place an order:",
    "",
    ...lines,
    "",
    `Total: ${total}`,
    "",
    "Pickup and delivery options can be confirmed when placing your order.",
    "",
    "Thank you!",
  ].join("\n");

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
