"use client";

import Loader from "@/components/Loader";
import { fetcher } from "@/constants";
import React from "react";
import useSWR from "swr";

export default function page() {
  const query = `/categories`;

  const { data, isLoading, error } = useSWR(query, fetcher);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <div>Categories: {JSON.stringify(data)}</div>;
}
