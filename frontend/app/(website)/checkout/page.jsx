"use client";

import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";
import { toImageUrl } from "@/lib/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const PAYMENT_OPTIONS = [
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay when your order arrives.",
  },
];

export default function page() {
  const router = useRouter();

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("cod");

  const hasCheckoutItems = checkoutItems.length > 0;

  const totalItems = useMemo(() => {
    return checkoutItems.reduce(
      (sum, item) => sum + Number(item?.quantity || 0),
      0,
    );
  }, [checkoutItems]);

  const grandTotal = useMemo(() => {
    return checkoutItems.reduce((sum, item) => {
      const quantity = Number(item?.quantity || 0);
      const price = Number(item?.price || 0);
      return sum + quantity * price;
    }, 0);
  }, [checkoutItems]);

  const finalTotal = useMemo(() => {
    return grandTotal + Number(deliveryFee || 0);
  }, [grandTotal]);

  const selectedAddress = useMemo(() => {
    return (
      addresses.find((address) => address.id === selectedAddressId) || null
    );
  }, [addresses, selectedAddressId]);

  const checkoutLineItems = useMemo(() => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return checkoutItems.map((item) => ({
        ...item,
        name: `Product #${item.id}`,
        imagePath: null,
      }));
    }

    const cartMap = new Map(cartItems.map((item) => [item.id, item]));

    return checkoutItems.map((item) => {
      const fullItem = cartMap.get(item.cartId);
      return {
        ...item,
        name: fullItem?.getProduct?.name || `Product #${item.id}`,
        imagePath: fullItem?.getProduct?.medias?.[0]?.path || null,
      };
    });
  }, [cartItems, checkoutItems]);

  const formatCurrency = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString()}`;

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        setIsLoading(true);

        const rawItems =
          typeof window !== "undefined"
            ? window.sessionStorage.getItem("checkout_items")
            : null;

        const parsedItems = rawItems ? JSON.parse(rawItems) : [];

        if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
          setCheckoutItems([]);
          return;
        }

        setCheckoutItems(parsedItems);

        const { data } = await api.get("/address");
        const safeAddresses = Array.isArray(data) ? data : [];
        setAddresses(safeAddresses);

        if (safeAddresses.length > 0) {
          setSelectedAddressId(safeAddresses[0].id);
        }

        const cartResponse = await api.get("/cart");
        setCartItems(
          Array.isArray(cartResponse?.data) ? cartResponse.data : [],
        );
      } catch (error) {
        console.error("Failed to initialize checkout:", error);
        toast.error("Failed to load checkout data");
      } finally {
        setIsLoading(false);
      }
    };

    initializeCheckout();
  }, []);

  const handlePlaceOrder = async () => {
    if (!hasCheckoutItems) {
      toast.error("Your checkout items are empty");
      return;
    }

    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!selectedPayment) {
      toast.error("Please select a payment option");
      return;
    }

    try {
      setIsPlacingOrder(true);

      const { data } = await api.post("/order", {
        items: checkoutItems,
      });

      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("checkout_items");
      }

      toast.success(data?.message || "Order placed successfully");

      const orderId = data?.orderId;
      router.push(
        orderId
          ? `/order/confirmation?orderId=${orderId}`
          : "/order/confirmation",
      );
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error(error?.response?.data?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="grid gap-4 py-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Card>
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Shipping Address</CardTitle>
              <Button asChild variant="link" className="h-auto p-0 text-sm">
                <Link href="/dashboard?tab=address">Edit</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {addresses.length === 0 ? (
              <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                You don't have any saved address. Add one from your dashboard
                address book.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  * Select an address to continue.
                </div>

                <div className="grid gap-2">
                  {addresses.map((address) => {
                    const isSelected = selectedAddressId === address.id;
                    return (
                      <button
                        key={address.id}
                        type="button"
                        onClick={() => setSelectedAddressId(address.id)}
                        className={`w-full rounded-md border p-3 text-left text-sm transition ${
                          isSelected
                            ? "border-primary bg-muted/30"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <p className="font-medium">{address.address}</p>
                        <p className="text-muted-foreground">
                          {address.city}, {address.state}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3">
            <div className="space-y-3 pt-1">
              {checkoutLineItems.map((item, index) => (
                <div
                  key={`${item.cartId}-${index}`}
                  className="flex items-start justify-between gap-3 border-t pt-3 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-16 w-16 overflow-hidden rounded-md border bg-muted/20">
                      {item.imagePath ? (
                        <img
                          src={toImageUrl(item.imagePath)}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-5">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-20">
          <CardHeader className="space-y-4 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-lg">Payment Options</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select how you want to pay.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {PAYMENT_OPTIONS.map((option) => {
                const isSelected = selectedPayment === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedPayment(option.id)}
                    className={`w-full rounded-md border p-3 text-left transition ${
                      isSelected
                        ? "border-primary bg-muted/30"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="text-sm font-medium">{option.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Order Detail</h3>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Items Total ({totalItems} items)
                </span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>

            <Button
              className="w-full"
              onClick={handlePlaceOrder}
              disabled={
                isPlacingOrder ||
                !selectedAddressId ||
                !selectedPayment ||
                !hasCheckoutItems
              }
            >
              {isPlacingOrder ? "Processing..." : "Place Order"}
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/cart">Back to Cart</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
