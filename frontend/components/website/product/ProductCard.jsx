"use client";

import { Heart, ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

export default function ProductCard({
  image,
  title,
  price,
  onAddToCart,
  onAddToWishlist,
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart?.();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleAddToWishlist = () => {
    onAddToWishlist?.();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group w-full max-w-sm rounded-sm border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300" />
      </div>

      <div className="p-5 flex flex-col justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">
            {title}
          </h3>

          <p className="text-xl font-bold text-gray-900">${price.toFixed(2)}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddToWishlist}
            className={`h-11 w-11 flex items-center justify-center rounded-sm border transition-all duration-300
              ${
                isWishlisted
                  ? "bg-red-50 border-red-500 text-red-500 scale-105"
                  : "bg-white border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-400"
              }`}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>

          <button
            onClick={handleAddToCart}
            className={`flex-1 h-11 flex items-center justify-center gap-2 rounded-sm font-medium transition-all duration-300
              ${
                isAdded
                  ? "bg-green-500 text-white"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
          >
            {isAdded ? (
              <>
                <Check size={18} />
                Added
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
