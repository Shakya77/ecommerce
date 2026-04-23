"use client";

import CartLayout from "@/components/website/cart/CartLayout";
import { fetcher } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import useSWR from "swr";

export default function Page() {
  const query = `/cart`;

  const { data, isLoading, error, mutate } = useSWR(query, fetcher);

  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
    }
  }, [isAuthenticated, loading]);

  return (
    <>
      <div className="my-4">
        <h1 className="text-2xl font-bold ">Your Cart</h1>
        <p className="text-sm text-gray-600">View your cart and checkout</p>
      </div>

      <CartLayout
        data={data}
        isLoading={isLoading}
        error={error}
        onRefresh={mutate}
      />
    </>
  );
}
