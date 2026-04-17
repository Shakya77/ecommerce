"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CartLayout from "@/components/website/cart/CartLayout";
import CartSummary from "@/components/website/cart/CartSummary";
import { fetcher } from "@/constants";
import Link from "next/link";
import useSWR from "swr";

export default function page() {
  const query = `/cart`;

  const { data, isLoading, error } = useSWR(query, fetcher);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Cart</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="my-4">
        <h1 className="text-2xl font-bold ">Your Cart</h1>
        <p className="text-sm text-gray-600">View your cart and checkout</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-3">
          <CartLayout data={data} />
        </div>

        <CartSummary />
      </div>
    </>
  );
}
