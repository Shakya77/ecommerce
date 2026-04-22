"use client";

import ProductCard from "./product/ProductCard";
import { toImageUrl } from "@/lib/image";
import useSWR from "swr";
import { fetcher } from "@/constants";

export default function HomeProduct() {
  const query = `/products?search&limit=10&page=1`;
  const { data } = useSWR(query, fetcher);

  return (
    <>
      <h1>
        <span className="text-xl font-bold">Popular Products</span>
      </h1>
      <div className="pt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {data?.data.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            image={toImageUrl(product.medias?.[0]?.path)}
            slug={product.slug}
            title={product.name}
            price={product.price}
            inStock={product.inStock}
          />
        ))}
      </div>
    </>
  );
}
