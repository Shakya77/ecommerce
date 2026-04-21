import HomeCarousel from "@/components/website/HomeCarousel";
import HomeCategory from "@/components/website/HomeCategory";
import HomeProduct from "@/components/website/HomrProduct";

export async function generateMetadata({ params }) {
  return {
    title: "Home | E-commerce",
    description: "Browse our collection of products",
  };
}

export default function main() {
  return (
    <main className="flex flex-col gap-6">
      <HomeCarousel />
      <HomeCategory />
      <HomeProduct />
    </main>
  );
}
