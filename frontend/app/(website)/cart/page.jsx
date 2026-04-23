"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import CartLayout from "@/components/website/cart/CartLayout";
import { RequireAuthDialog } from "@/components/website/RequireAuthDialog";
import { fetcher } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

export default function Page() {
  const [open, setOpen] = useState(false);

  const query = `/cart`;
  const { isAuthenticated, loading } = useAuth();

  const shouldFetch = !loading && isAuthenticated;

  const { data, isLoading, error, mutate } = useSWR(
    shouldFetch ? query : null,
    fetcher,
  );

  return (
    <>
      <div className="my-4">
        <h1 className="text-2xl font-bold ">Your Cart</h1>
        <p className="text-sm text-gray-600">View your cart and checkout</p>
      </div>

      {!loading && !isAuthenticated ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShoppingCart />
            </EmptyMedia>
            <EmptyTitle>Cart </EmptyTitle>
            <EmptyDescription>
              Please Login in order to view your cart.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Link href="/products">Browse Products</Link>
              </Button>

              <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                Login
              </Button>
              <RequireAuthDialog
                open={open}
                onOpenChange={setOpen}
                action={"cart"}
              />
            </div>
          </EmptyContent>
        </Empty>
      ) : (
        <CartLayout
          data={data}
          isLoading={isLoading}
          error={error}
          onRefresh={mutate}
        />
      )}
    </>
  );
}
