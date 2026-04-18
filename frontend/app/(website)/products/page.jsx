import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProductCard from "@/components/website/product/ProductCard";
import { toImageUrl } from "@/lib/image";
import { getProducts } from "@/services/website.http";
import Link from "next/link";

export async function generateMetadata({ params }) {
  return {
    title: "Products | E-commerce",
    description: "Browse our collection of products",
  };
}

export default async function Page() {
  const data = await getProducts();

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
