"use client";

import { useState } from "react";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { fetcher } from "@/constants";
import { toImageUrl } from "@/lib/image";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";
import { RequireAuthDialog } from "@/components/website/RequireAuthDialog";
import { onAddToCart } from "@/services/website.http";
import AddToCartButton from "@/components/website/product/AddToCartButton";
import { toast } from "sonner";
import { QuantityInput } from "@/components/QuantityInput";
import WishlistButton from "@/components/WishlistButton";
import DOMPurify from "dompurify";

export default function ProductDetail({ slug }) {
  const {
    data: product,
    error,
    isLoading,
  } = useSWR(`/products/${slug}`, fetcher);

  const { isAuthenticated, loading } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [authPromptAction, setAuthPromptAction] = useState(null);

  const requiresAuth = !loading && !isAuthenticated;

  const promptForAuth = (action) => {
    if (requiresAuth) {
      setAuthPromptAction(action);
      return true;
    }

    return false;
  };

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

  const primaryImage = toImageUrl(product?.medias?.[0]?.path);

  const allImages = product?.medias || [];

  const currentImage = selectedImage || primaryImage;

  const handleAddToCart = async () => {
    if (promptForAuth("cart")) {
      return;
    }

    setIsAddingToCart(true);

    const { data } = await onAddToCart(product.id, quantity);
    toast.success(data?.message);

    setTimeout(() => {
      setQuantity(1);
      setIsAddingToCart(false);
    }, 500);
  };

  const descripion = DOMPurify.sanitize(product.description);

  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12 mt-3">
        <div className="flex flex-col">
          <div className="mb-4 flex aspect-square items-center justify-center overflow-hidden bg-gray-50">
            <img
              src={currentImage}
              alt={product?.name || "Product image"}
              className="h-full w-full object-contain transition-all duration-300"
            />
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-3">
              {allImages.map((image, idx) => {
                const imgUrl = toImageUrl(image.path);

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`flex h-20 w-20 items-center justify-center border bg-gray-50 transition-colors ${
                      currentImage === imgUrl
                        ? "border-black"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Product view ${idx + 1}`}
                      className="h-full w-full object-contain p-2"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          {product.productCategories?.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {product.productCategories.slice(0, 3).map((pc) => (
                <Badge key={pc.id} variant="secondary">
                  {pc.category.name}
                </Badge>
              ))}
            </div>
          )}

          <h1 className="mb-4 text-2xl font-semibold text-black sm:text-3xl">
            {product.name}
          </h1>

          <div className="mb-6 border-b border-gray-200 pb-6">
            <p className="text-3xl font-bold text-black">
              Rs. {product.price.toLocaleString("en-IN")}
            </p>
          </div>

          {product.description && (
            <div className="mb-8 border-b border-gray-200 pb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase text-black">
                Key Features
              </h2>

              <div className="prose prose-sm max-w-none text-sm leading-relaxed text-gray-700">
                {showFullDescription ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: descripion,
                    }}
                  />
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: descripion.slice(0, 1050) + "...",
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

            <QuantityInput value={quantity} onChange={setQuantity} />

            <div className="flex gap-3">
              <AddToCartButton
                onClick={handleAddToCart}
                isLoading={isAddingToCart}
                className="flex h-12 flex-1 items-center justify-center gap-2 bg-black text-white"
                iconClassName="mr-2 h-5 w-5"
                iconSize={20}
                addedText="Added"
              />

              <WishlistButton
                isWishlisted={isWishlisted}
                onToggle={setIsWishlisted}
              />
            </div>
          </div>
        </div>
      </div>

      <RequireAuthDialog
        open={Boolean(authPromptAction)}
        onOpenChange={(open) => {
          if (!open) {
            setAuthPromptAction(null);
          }
        }}
        action={authPromptAction}
      />
    </>
  );
}
