"use client";

import { useEffect, useState } from "react";
import ProductCard from "./product/ProductCard";
import api from "@/lib/api";
import { toImageUrl } from "@/lib/image";

export default function HomeProduct() {
  const [data, setData] = useState([]);

  const getProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setData(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <h1>
        <span className="text-xl font-bold">Popular Products</span>
      </h1>
      <div className="pt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {data?.map((product) => (
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
