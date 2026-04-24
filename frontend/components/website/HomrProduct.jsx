"use client";

import ProductCard from "./product/ProductCard";
import { toImageUrl } from "@/lib/image";
import useSWR from "swr";
import { fetcher } from "@/constants";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useCallback, useEffect, useState } from "react";
import { LoadingSpinner } from "../loading-spinner";

export default function HomeProduct() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const query = `/products?search&limit=10&page=${page}`;
  const { data } = useSWR(query, fetcher);

  useEffect(() => {
    if (!data) return;

    if (page === 1) {
      setItems(data.data);
    } else {
      setItems((prev) => [...prev, ...data.data]);
    }

    setHasMore(data.hasMore);
    setLoadingMore(false);
  }, [data, page]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      setPage((prev) => prev + 1);
    }, 3000);
  }, [hasMore, loadingMore]);

  const [infiniteRef] = useInfiniteScroll({
    loading: loadingMore,
    hasNextPage: hasMore,
    onLoadMore: loadMore,
    disabled: false,
    rootMargin: "0px 0px 400px 0px",
  });

  return (
    <>
      <h1>
        <span className="text-xl font-bold">Popular Products</span>
      </h1>

      <div className="pt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((product) => (
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

      {loadingMore && <LoadingSpinner />}

      {/* 👇 Infinite scroll trigger */}
      <div ref={infiniteRef} className="h-10" />
    </>
  );
}
