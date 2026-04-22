"use client";

import { Input } from "@/components/ui/input";
import ProductCard from "@/components/website/product/ProductCard";
import { fetcher } from "@/constants";
import { toImageUrl } from "@/lib/image";
import { useEffect, useState, useCallback } from "react";
import useSWR from "swr";
import useInfiniteScroll from "react-infinite-scroll-hook";

export default function Page() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const query = `/products?search=${search}&limit=8&page=${page}`;
  const { data } = useSWR(query, fetcher);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [search]);

  // append data
  useEffect(() => {
    if (!data) return;

    setItems((prev) => [...prev, ...data.data]);
    setHasMore(data.hasMore);

    setLoadingMore(false); // 👈 important
  }, [data]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);

    setTimeout(() => {
      setPage((prev) => prev + 1);
    }, 3000);
  }, [hasMore, loadingMore]);

  const [infiniteRef] = useInfiniteScroll({
    loading: !data,
    hasNextPage: hasMore,
    onLoadMore: loadMore,
    disabled: false,
    rootMargin: "0px 0px 400px 0px",
  });

  const getCategories = async () => {
    const { data } = await fetcher("/categories");
    setCategories(data);
  };

  useEffect(() => {
    document.title = "Products - My E-commerce Store";
    getCategories();
  }, []);

  return (
    <>
      {/* Search */}
      <div className="mb-6 w-sm">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Products */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            image={toImageUrl(product.medias?.[0]?.path)}
            slug={product.slug}
            title={product.name}
            price={product.price}
          />
        ))}
      </div>

      {/* Sentinel */}
      <div ref={infiniteRef} className="h-10" />

      {loadingMore && (
        <div className="text-center py-4 text-gray-500">
          Loading more products...
        </div>
      )}

      {/* End */}
      {!hasMore && (
        <p className="text-center text-gray-500 mt-4">No more products</p>
      )}
    </>
  );
}
