import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

export default function HomeCarousel() {
  const slides = [
    { id: 1, image: "/banner1.jpg", title: "Big Sale" },
    { id: 2, image: "/banner2.jpg", title: "New Arrivals" },
    { id: 3, image: "/banner3.jpg", title: "Best Deals" },
  ];

  return (
    <Carousel className="w-full h-100">
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="relative w-full h-100">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover rounded-xl"
              />

              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h2 className="text-white text-4xl font-bold">{slide.title}</h2>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
