import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useMemo, useState } from "react";
import CartCard from "./CartCard";
import CartSummary from "./CartSummary";
import Loader from "@/components/Loader";
import {
  onRemoveCartItem,
  onUpdateCartItemQuantity,
} from "@/services/website.http";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartLayout({ data, isLoading, error, onRefresh }) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const cartItems = Array.isArray(data) ? data : [];

  useEffect(() => {
    setSelectedIds((prev) =>
      prev.filter((id) => cartItems.some((item) => item.id === id)),
    );
  }, [cartItems]);

  const selectedItems = useMemo(
    () =>
      cartItems
        .filter((item) => selectedIds.includes(item.id))
        .map((item) => ({
          cartId: item.id,
          id: item.getProduct.id,
          price: item.price,
          quantity: item.quantity,
        })),
    [cartItems, selectedIds],
  );

  const allSelected =
    cartItems.length > 0 && selectedIds.length === cartItems.length;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(cartItems.map((item) => item.id));
      return;
    }

    setSelectedIds([]);
  };

  const handleSelectItem = (itemId, checked) => {
    setSelectedIds((prev) => {
      if (checked) {
        return prev.includes(itemId) ? prev : [...prev, itemId];
      }
      return prev.filter((id) => id !== itemId);
    });
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0 || isCheckingOut) {
      return;
    }

    try {
      setIsCheckingOut(true);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          "checkout_items",
          JSON.stringify(selectedItems),
        );
      }

      router.push("/checkout");
    } catch (error) {
      toast.error("Failed to proceed to checkout");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleQuantityChange = async (itemId, nextQuantity) => {
    const response = await onUpdateCartItemQuantity(itemId, nextQuantity);

    if (!response) {
      toast.error("Failed to update quantity");
      return;
    }

    toast.success(response?.data?.message);
    await onRefresh?.();
  };

  const handleDeleteItem = async (itemId) => {
    const response = await onRemoveCartItem(itemId);

    if (!response) {
      toast.error("Failed to remove cart item");
      return;
    }

    toast.success(response?.data?.message || "Item removed from cart");
    await onRefresh?.();
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Could not load cart items. Please try again.
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShoppingCart />
          </EmptyMedia>
          <EmptyTitle>Cart Empty</EmptyTitle>
          <EmptyDescription>
            You haven't added any products to your cart yet. Start exploring our
            amazing products and add them to your cart!
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="sm">
            <Link href="/products">Browse Products</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      <div className="space-y-4 md:col-span-3">
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
          <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <Checkbox
              checked={allSelected}
              onCheckedChange={(value) => handleSelectAll(Boolean(value))}
              className="h-5 w-5"
            />
            Select all products
          </label>
          <span className="text-sm text-gray-500">
            {selectedIds.length} selected
          </span>
        </div>

        {cartItems.map((item) => (
          <CartCard
            key={item.id}
            data={item}
            checked={selectedIds.includes(item.id)}
            onCheckedChange={(checked) => handleSelectItem(item.id, checked)}
            quantity={item.quantity}
            onQuantityChange={(nextQuantity) =>
              handleQuantityChange(item.id, nextQuantity)
            }
            onDelete={() => handleDeleteItem(item.id)}
          />
        ))}
      </div>

      <CartSummary
        data={selectedItems}
        onCheckout={handleCheckout}
        isCheckingOut={isCheckingOut}
      />
    </div>
  );
}
