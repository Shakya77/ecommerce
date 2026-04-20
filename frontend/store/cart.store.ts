// /store/cart.store.ts
import api from "@/lib/api";
import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  cart: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/cart");
      set({ cart: data });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (productId: number) => {
    try {
      await api.post("/cart", { productId, quantity: 1 });

      await get().fetchCart(); // sync
    } catch (err) {
      console.error(err);
    }
  },

  removeFromCart: async (id: number) => {
    try {
      await api.delete(`/cart/${id}`);

      // refetch fresh data from server
      await get().fetchCart();
    } catch (err) {
      console.error(err);
    }
  },

  updateQuantity: async (id: number, quantity: number) => {
    try {
      await api.patch(`/cart/${id}`, { quantity });

      await get().fetchCart();
    } catch (err) {
      console.error(err);
    }
  },
}));
