"use client";

import WishLists from "@/components/website/wishlist/WishLists";
import { fetcher } from "@/constants";
import { useEffect } from "react";
import useSWR from "swr";

export default function page() {
  const { data, error, isLoading } = useSWR("/wishlist", fetcher);

  useEffect(() => {
    document.title = "Wishlist - E-commerce";
  }, []);

  return <WishLists data={data} />;
}
