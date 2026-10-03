import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import { getCartSubtotal, getCartItemCount } from "@/lib/cart-totals";

interface CartState {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: (products: Product[]) => number;
  getItemCount: (products: Product[]) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === productId);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { productId, quantity }] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),

      increment: (productId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        })),

      decrement: (productId) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === productId);
          if (existing && existing.quantity <= 1) {
            return { items: state.items.filter((item) => item.productId !== productId) };
          }
          return {
            items: state.items.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
          };
        }),

      setQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.productId !== productId) };
          }
          return {
            items: state.items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      getSubtotal: (products) => getCartSubtotal(get().items, products),

      getItemCount: (products) => getCartItemCount(get().items, products),
    }),
    {
      name: "wc-cart",
      partialize: (state) => ({ items: state.items }),
      // Rehydration is triggered explicitly (see CartButton) after mount, so the
      // first client render always matches the server's empty-cart render —
      // otherwise persisted localStorage data hydrates before React's
      // server/client comparison and throws a hydration mismatch.
      skipHydration: true,
    }
  )
);
