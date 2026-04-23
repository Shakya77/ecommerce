"use client";

import api from "@/lib/api";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [count, setCountState] = useState(0);
  const { isAuthenticated, loading, user } = useAuth();

  const fetchCount = async () => {
    try {
      const { data } = await api.get("/cart/count");
      setCountState(data.count);
    } catch (error) {
      console.error("Failed to fetch cart count", error);
    }
  };

  useEffect(() => {
    if (loading) return;

    setCountState(0);

    if (isAuthenticated) {
      fetchCount();
    }
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        count,
        refreshCount: fetchCount,
        setCountState,
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
