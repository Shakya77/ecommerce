"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import { fetcher } from "@/constants";
import { toImageUrl } from "@/lib/image";
import Loader from "@/components/Loader";

export default function ProductDetail({ slug }) {
  const {
    data: product,
    error,
    isLoading,
  } = useSWR(`/products/${slug}`, fetcher);

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-6">
        <p className="text-sm text-red-600">Failed to load product details.</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-6">
        <p className="text-sm text-gray-600">Product not found.</p>
      </main>
    );
  }

  const primaryImage =
    toImageUrl(product?.medias?.[0]?.path) || "/placeholder.jpg";

  const allImages = product?.medias || [];

  const currentImage = selectedImage || primaryImage;

  const handleQuantityChange = (value) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) setQuantity(num);
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    setTimeout(() => {
      console.log(`Added ${quantity} item(s) to cart`);
      setIsAddingToCart(false);
    }, 500);
  };

  const toggleWishlist = () => {
    setIsWishlisted((prev) => !prev);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      <div className="flex flex-col">
        <div className="mb-4 bg-gray-50 aspect-square flex items-center justify-center overflow-hidden">
          <img
            src={currentImage}
            alt={product?.name || "Product image"}
            className="w-full h-full object-contain transition-all duration-300"
          />
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-3">
            {allImages.map((image, idx) => {
              const imgUrl = toImageUrl(image.path);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 h-20 bg-gray-50 border flex items-center justify-center transition-colors ${
                    currentImage === imgUrl
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Product view ${idx + 1}`}
                    className="w-full h-full object-contain p-2"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        {product.productCategories?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {product.productCategories.slice(0, 3).map((pc) => (
              <Badge key={pc.id} variant="secondary">
                {pc.category.name}
              </Badge>
            ))}
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-semibold text-black mb-4">
          {product.name}
        </h1>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <p className="text-3xl font-bold text-black">
            Rs. {product.price.toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-gray-600 mt-2">Free Shipping Available</p>
        </div>

        {product.description && (
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-black mb-3 uppercase">
              Key Features
            </h2>

            <div className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none">
              {showFullDescription ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: product.description,
                  }}
                />
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: product.description.slice(0, 250) + "...",
                  }}
                />
              )}
            </div>

            <button
              onClick={() => setShowFullDescription((prev) => !prev)}
              className="mt-3 text-sm font-medium text-blue-600 hover:underline"
            >
              {showFullDescription ? "Show Less" : "Show More"}
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold uppercase">Quantity</label>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={decrementQuantity}>
              <Minus className="h-4 w-4" />
            </Button>

            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="w-16 text-center"
            />

            <Button variant="outline" size="icon" onClick={incrementQuantity}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1 h-12 bg-black text-white"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleWishlist}
              className={`h-12 w-12 ${isWishlisted ? "bg-red-50" : ""}`}
            >
              <Heart
                className={`h-5 w-5 ${
                  isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700"
                }`}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
