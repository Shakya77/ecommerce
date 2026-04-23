"use client";

import { fetcher } from "@/constants";
import useSWR from "swr";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function HomeCategory() {
  const { data, isLoading, error } = useSWR("/categories", fetcher);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load</p>;

  return (
    <div className="flex flex-col gap-4">
      <h1>
        <span className="text-xl font-bold">Shop by Category</span>
      </h1>
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {data?.map((category) => (
            <CarouselItem
              key={category.id}
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
            >
              <CategoryCard category={category} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

function CategoryCard({ category }) {
  const router = useRouter();

  return (
    <div
      className="p-4 border rounded-lg bg-white hover:shadow-md transition cursor-pointer"
      onClick={() => {
        router.push(`/products?category=${category.id}`);
      }}
    >
      <h3 className="text-sm font-semibold text-center">{category.name}</h3>
    </div>
  );
}
