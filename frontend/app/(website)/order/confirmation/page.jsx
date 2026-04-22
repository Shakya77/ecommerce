"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function page() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Order Confirmed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Your checkout was successful and your order has been placed.
          </p>
          {orderId ? (
            <p className="text-sm">
              Order reference: <span className="font-semibold">#{orderId}</span>
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-2">
            {orderId ? (
              <Button asChild>
                <Link href={`/order/${orderId}`}>View Order Details</Link>
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link href="/dashboard?tab=orders">Go to My Orders</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
