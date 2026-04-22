"use client";

import Loader from "@/components/Loader";
import WishLists from "@/components/website/wishlist/WishLists";
import { fetcher } from "@/constants";
import { useEffect } from "react";
import useSWR from "swr";

export default function page() {
  const { data, error, isLoading } = useSWR("/wishlist", fetcher);

  useEffect(() => {
    document.title = "Wishlist - E-commerce";
  }, []);

  if (isLoading) return <Loader />;

  return (
    <>
      <h1 className="text-2xl font-bold mt-6">My Wishlist</h1>
      <WishLists data={data} />
    </>
  );
}
