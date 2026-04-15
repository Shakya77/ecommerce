"use client";

import WishLists from "@/components/website/wishlist/WishLists";
import { fetcher } from "@/constants";
import useSWR from "swr";

export default function page() {
  const { data, error, isLoading } = useSWR("/wishlist", fetcher);

  return <WishLists data={data} />;
}
