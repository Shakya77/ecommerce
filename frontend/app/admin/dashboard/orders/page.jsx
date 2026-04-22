"use client";

import { fetcher } from "@/constants";
import useSWR from "swr";

export default function page() {
  const { data, error, isLoading } = useSWR("/order", fetcher);

  return <div></div>;
}
