"use client";

import Layout from "@/components/website/category/Layout";
import { useEffect } from "react";

export default function page() {
  useEffect(() => {
    document.title = "Categories - E-commerce";
  }, []);

  return <Layout />;
}
