"use client";

import { Input } from "@/components/ui/input";
import ProductCard from "@/components/website/product/ProductCard";
import { fetcher } from "@/constants";
import { toImageUrl } from "@/lib/image";
import { useEffect, useState, useCallback } from "react";
import useSWRInfinite from "swr/infinite";
import useInfiniteScroll from "react-infinite-scroll-hook";
import CategoryCheckbox from "@/components/website/category/CategoryCheckbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function Page() {
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.hasMore) return null;

    const params = new URLSearchParams({
      search,
      limit: "8",
      page: (pageIndex + 1).toString(),
    });

    if (checked.length > 0) {
      params.append("categories", checked.join(","));
    }

    return `/products?${params.toString()}`;
  };

  const { data, size, setSize, mutate } = useSWRInfinite(getKey, fetcher);

  const { data: categoryData } = useSWR("/categories", fetcher);

  const items = data ? data.flatMap((page) => page.data) : [];
  const hasMore = data?.[data.length - 1]?.hasMore;

  useEffect(() => {
    if (categoryFromUrl) {
      setChecked([Number(categoryFromUrl)]);
    }
  }, [categoryFromUrl]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      setSize(size + 1);
    }, 3000);
  }, [hasMore, loadingMore, size, setSize]);

  useEffect(() => {
    setLoadingMore(false);
  }, [data]);

  const [infiniteRef] = useInfiniteScroll({
    loading: loadingMore,
    hasNextPage: hasMore,
    onLoadMore: loadMore,
    rootMargin: "0px 0px 400px 0px",
  });

  const handleCheck = (id) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const clearFilters = () => {
    setChecked([]);
    setSearch("");
    mutate();
  };

  useEffect(() => {
    setSize(1);
  }, [search, checked]);

  useEffect(() => {
    document.title = "Products - My E-commerce Store";
  }, []);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="mb-2 flex items-center justify-between text-sm font-medium">
            Filters:
            <Button className="w-fit" onClick={clearFilters}>
              Clear
            </Button>
          </div>

          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="flex w-full flex-col gap-2 mt-3"
          >
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-sm font-bold">Category</h4>

              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <ChevronsUpDown />
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="flex flex-col gap-2">
              {categoryData?.map((category) => (
                <CategoryCheckbox
                  key={category.id}
                  id={category.id}
                  name={category.name?.toLowerCase()}
                  checked={checked.includes(category.id)}
                  onChange={handleCheck}
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="lg:col-span-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

          {loadingMore && (
            <div className="col-span-full flex justify-center py-6">
              <LoadingSpinner />
            </div>
          )}

          {items.length === 0 && !loadingMore && (
            <div className="col-span-full flex flex-col items-center justify-center py-10 h-fit">
              <p className="text-lg font-medium text-gray-700 text-center">
                {search && checked.length > 0
                  ? `No results for "${search}" in selected categories`
                  : search
                    ? `No results found for "${search}"`
                    : checked.length > 0
                      ? "No products in selected category"
                      : "No products found"}
              </p>

              <p className="text-sm text-gray-500 mt-1 text-center">
                Try adjusting your search or filters
              </p>

              <Button className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}

          {items.length > 0 && !hasMore && (
            <div className="col-span-full flex justify-center py-6">
              <p className="text-gray-500">No more products</p>
            </div>
          )}
        </div>
      </div>

      <div ref={infiniteRef} className="h-10" />
    </>
  );
}
