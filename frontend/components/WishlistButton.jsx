import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function WishlistButton({
  isWishlisted: controlledWishlisted,
  onToggle,
  size = "icon",
  variant = "outline",
}) {
  const [internalWishlisted, setInternalWishlisted] = useState(false);

  const isWishlisted =
    controlledWishlisted !== undefined
      ? controlledWishlisted
      : internalWishlisted;

  const handleToggle = () => {
    if (controlledWishlisted === undefined) {
      setInternalWishlisted(!isWishlisted);
    }
    onToggle?.(!isWishlisted);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      className={`h-12 w-12 ${isWishlisted ? "bg-red-50" : ""}`}
    >
      <Heart
        className={`h-5 w-5 ${
          isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700"
        }`}
      />
    </Button>
  );
}
