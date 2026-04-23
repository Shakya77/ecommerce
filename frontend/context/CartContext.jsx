"use client";

import api from "@/lib/api";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [count, setCountState] = useState(0);

  const fetchCount = async () => {
    try {
      const { data } = await api.get("/cart/count");
      setCountState(data.count);
    } catch (error) {
      console.error("Failed to fetch cart count", error);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <CartContext.Provider
      value={{
        count,
        refreshCount: fetchCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
