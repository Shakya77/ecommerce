"use client";

import api from "@/lib/api";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { useEffect, useState } from "react";
import { toImageUrl } from "@/lib/image";
import Loader from "../Loader";

export default function HomeCarousel() {
  const [carousels, setCarousels] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCarousels = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/carousels");
      setCarousels(
        data.map((item) => ({
          id: item.id,
          image: toImageUrl(item.imageUrl),
          title: item.name,
        })),
      );

      return data;
    } catch (error) {
      console.error("Failed to fetch carousels:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCarousels();
  }, []);

  if (loading) return <Loader />;

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {carousels.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="relative w-full h-64 md:h-fit">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover rounded-xl"
              />

              <div className="absolute inset-0 bg-black/40 flex items-center justify-center"></div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
