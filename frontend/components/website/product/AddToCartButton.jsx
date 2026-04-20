"use client";

import { Check, ShoppingCart } from "lucide-react";

export default function AddToCartButton({
  onClick,
  disabled = false,
  isLoading = false,
  isAdded = false,
  defaultText = "Add to Cart",
  loadingText = "Adding...",
  addedText = "Added",
  className = "",
  iconClassName = "",
  iconSize = 18,
  ariaLabel = "Add to cart",
}) {
  const buttonDisabled = disabled || isLoading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={buttonDisabled}
      className={className}
      aria-label={ariaLabel}
    >
      {isAdded ? (
        <>
          <Check size={iconSize} className={iconClassName} />
          {addedText}
        </>
      ) : (
        <>
          <ShoppingCart size={iconSize} className={iconClassName} />
          {isLoading ? loadingText : defaultText}
        </>
      )}
    </button>
  );
}
