"use client";

import ProductForm from "@/components/admin/dashboard/product/ProductForm";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();

  return <ProductForm mode="edit" productId={id} />;
}
