"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { RequireAuthDialog } from "@/components/website/RequireAuthDialog";
import AddToCartButton from "@/components/website/product/AddToCartButton";
import { onAddToCart as addToCartRequest } from "@/services/website.http";

export default function ProductCard({
  id,
  image,
  slug,
  title,
  price,
  onAddToCart: onAddToCartProp,
  onAddToWishlist,
}) {
  const { isAuthenticated, loading } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [authPromptAction, setAuthPromptAction] = useState(null);

  const requiresAuth = !loading && !isAuthenticated;

  const handleAddToCart = async () => {
    if (requiresAuth) {
      setAuthPromptAction("cart");
      return;
    }

    if (!id) {
      return;
    }

    setIsAddingToCart(true);

    const addToCart = addToCartRequest;
    const response = await addToCart(id, 1);

    setIsAddingToCart(false);

    if (!response) {
      return;
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleAddToWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (requiresAuth) {
      setAuthPromptAction("wishlist");
      return;
    }

    onAddToWishlist?.(id);
    setIsWishlisted((prev) => !prev);
  };

  return (
    <div className="group w-full max-w-sm overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
      <Link href={`/products/${slug}`} className="block">
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
        </div>
      </Link>

      <div className="flex flex-col justify-between gap-3 p-5">
        <div className="space-y-1">
          <Link href={`/products/${slug}`} className="block">
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900 transition-colors hover:text-black">
              {title}
            </h3>
          </Link>

          <p className="text-sm font-bold text-gray-900">Rs. {price}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddToWishlist}
            className={`flex h-9 w-9 items-center justify-center rounded-sm border transition-all duration-300
              ${
                isWishlisted
                  ? "scale-105 border-red-500 bg-red-50 text-red-500"
                  : "border-gray-300 bg-white text-gray-600 hover:border-red-400 hover:text-red-400"
              }`}
            aria-label="Add to wishlist"
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>

          <AddToCartButton
            onClick={handleAddToCart}
            isLoading={isAddingToCart}
            isAdded={isAdded}
            className={`flex h-9 flex-1 items-center justify-center gap-2 rounded-sm font-medium transition-all duration-300 ${
              isAdded
                ? "bg-green-500 text-white"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          />
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
    </div>
  );
}
