import ProductCard from "@/components/website/product/ProductCard";
import { toImageUrl } from "@/lib/image";
import { getProducts } from "@/services/website.http";

export default async function Page() {
  const data = await getProducts(); 

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
  );
}
