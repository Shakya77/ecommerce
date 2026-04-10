"use client";

import ProductForm from "@/components/dashboard/product/ProductForm";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  return <ProductForm mode="edit" productId={params.id} />;
}
