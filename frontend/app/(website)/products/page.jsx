"use client";
import ProductCard from "@/components/website/product/ProductCard";

const sampleProducts = [
  {
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    title: "Premium Wireless Headphones",
    price: 129.99,
  },
  {
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    title: "Elegant Wristwatch",
    price: 249.99,
  },
  {
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    title: "Sunglasses Collection",
    price: 89.99,
  },
  {
    image:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&h=500&fit=crop",
    title: "Sneaker Pro Max",
    price: 119.99,
  },
];

export default function page() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {sampleProducts.map((product, index) => (
        <ProductCard
          key={index}
          image={product.image}
          title={product.title}
          price={product.price}
          inStock={product.inStock}
          onAddToCart={() => alert(`${product.title} added to cart!`)}
          onAddToWishlist={() => alert(`${product.title} added to wishlist!`)}
        />
      ))}
    </div>
  );
}
