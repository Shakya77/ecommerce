import ProductDetail from "@/components/website/product/slug/ProductDetail";
import { getProductBySlug } from "@/services/website.http";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product?.name || "Products",
    description: product?.description || "Browse our collection of products",
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  return <ProductDetail slug={slug} />;
}
