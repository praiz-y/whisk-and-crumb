import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

export function getCartSubtotal(items: CartItem[], products: Product[]): number {
  return items.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return total;
    return total + product.price * item.quantity;
  }, 0);
}

export function getCartItemCount(items: CartItem[], products: Product[]): number {
  return items.reduce((count, item) => {
    const exists = products.some((p) => p.id === item.productId);
    return exists ? count + item.quantity : count;
  }, 0);
}
