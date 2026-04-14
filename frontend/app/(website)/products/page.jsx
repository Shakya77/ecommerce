"use client";
import ProductCard from "@/components/website/product/ProductCard";
import { fetcher } from "@/constants";
import { toImageUrl } from "@/lib/image";
import useSWR from "swr";

export default function page() {
  const query = `/products`;
  const { data, error, isLoading, mutate } = useSWR(query, fetcher);

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {data?.map((product, index) => (
        <ProductCard
          key={index}
          image={toImageUrl(product.medias[0].path)}
          slug={product.slug}
          title={product.name}
          price={product.price}
          inStock={product.inStock}
          onAddToCart={() => alert(`${product.name} added to cart!`)}
          onAddToWishlist={() => alert(`${product.name} added to wishlist!`)}
        />
      ))}
    </div>
  );
}
