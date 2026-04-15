import ProductDetail from "@/components/website/product/slug/ProductDetail";

export default async function ProductPage({ params }) {
  const { slug } = await params;

  return <ProductDetail slug={slug} />;
}
