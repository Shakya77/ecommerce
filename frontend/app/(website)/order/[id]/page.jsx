"use client";

import Invoice from "@/components/invoice";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/currency";
import { toImageUrl } from "@/lib/image";
import { getUserAddress, getUserOrderById } from "@/services/website.http";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function page() {
  const params = useParams();
  const orderId = params?.id;
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoDetails, setPromoDetails] = useState(null);
  const [discount, setDiscount] = useState(0);

  const orderItems = useMemo(() => {
    return Array.isArray(order?.orderItems) ? order.orderItems : [];
  }, [order]);

  const subTotal = useMemo(() => {
    return orderItems.reduce((sum, item) => {
      const quantity = Number(item?.quantity || 0);
      const price = Number(item?.price || 0);
      return sum + quantity * price;
    }, 0);
  }, [orderItems]);

  const grandTotal = useMemo(() => {
    if (!promoDetails) {
      return subTotal;
    }

    return subTotal - promoDetails.value;
  }, [promoDetails, subTotal]);

  const calculateDiscount = (promoDetails) => {
    const type = promoDetails.promoType;
    const value = promoDetails.value;

    if (type === "amount") {
      return value;
    }

    return (subTotal * value) / 100;
  };

  const totalItems = useMemo(() => {
    return orderItems.reduce(
      (sum, item) => sum + Number(item?.quantity || 0),
      0,
    );
  }, [orderItems]);

  const isPending = String(order?.status || "").toUpperCase() === "PENDING";

  useEffect(() => {
    const loadData = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [orderData, addressData] = await Promise.all([
          getUserOrderById(orderId),
          getUserAddress(),
        ]);

        setAddresses(addressData);

        if (!orderData) {
          toast.error("Order not found");
          setOrder(null);
          return;
        }

        setOrder(orderData);

        const initialAddressId = addresses[0]?.id;
        setSelectedAddressId(initialAddressId);
      } catch (error) {
        console.error("Failed to load order data:", error);
        toast.error("Failed to load order data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [orderId]);

  const handleConfirmOrder = async () => {
    if (!order?.id) {
      toast.error("Order not found");
      return;
    }

    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }

    try {
      setIsConfirmingOrder(true);

      const payload = {
        addressId: selectedAddressId,
        promoId: promoDetails?.id ?? null,
        subTotal,
        discount,
        totalAmount: grandTotal,
      };

      const { data } = await api.patch(`/order/${order.id}`, payload);

      toast.success(data?.message || "Order confirmed successfully");

      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (error) {
      console.error("Failed to confirm order:", error);
      toast.error(error?.response?.data?.message || "Failed to confirm order");
    } finally {
      setIsConfirmingOrder(false);
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode) {
      toast.error("Please enter a promo code");
      return;
    }

    try {
      const { data } = await api.get("/promo/getByCode/" + promoCode);
      setPromoDetails(data);
      const discountAmount = calculateDiscount(data);
      setDiscount(discountAmount);
      toast.success(data.message || "Promo applied successfully");
    } catch (error) {
      console.error("Failed to apply coupon:", error);
      toast.error(error?.response?.data?.message || "Failed to apply coupon");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Order not found</h1>
        <p className="text-sm text-muted-foreground">
          The order does not exist or you do not have access.
        </p>
        <Button asChild variant="outline">
          <Link href="/dashboard?tab=orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm">
        <Link href="/dashboard?tab=orders">Back to Orders</Link>
      </Button>

      {isPending ? (
        <div className="grid gap-4 lg:grid-cols-3">
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
              <CardContent>
                {addresses.length === 0 ? (
                  <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                    You don&apos;t have any saved address. Add one from your
                    dashboard address book.
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
                  {orderItems.map((item) => {
                    const product = item?.getProduct || {};
                    const quantity = Number(item?.quantity || 0);
                    const price = Number(item?.price || 0);

                    return (
                      <div
                        key={item.id}
                        className="flex items-start justify-between gap-3 border-t pt-3 first:border-t-0 first:pt-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-16 w-16 overflow-hidden rounded-md border bg-muted/20">
                            {product.medias?.[0]?.path ? (
                              <img
                                src={toImageUrl(product.medias[0].path)}
                                alt={product.name || "Product image"}
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-5">
                              {product.name || `Product #${item.productId}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {quantity}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold">
                          {formatCurrency(price)}
                        </p>
                      </div>
                    );
                  })}
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
                    Selected method for this order.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <button
                  type="button"
                  disabled
                  className="w-full cursor-default rounded-md border border-primary bg-muted/30 p-3 text-left"
                >
                  <p className="text-sm font-medium">Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground">
                    Pay when your order arrives.
                  </p>
                </button>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Order Detail</h3>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Items Total ({totalItems} items)
                    </span>
                    <span>{formatCurrency(subTotal)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-lg font-semibold">
                  <InputGroup>
                    <InputGroupInput
                      placeholder="Enter the Promo Code"
                      onInput={(event) => {
                        setPromoCode(event.target.value);
                      }}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        className="px-4 py-4"
                        onClick={() => handleApplyPromo()}
                      >
                        Apply
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </div>

                <Separator />

                <div className="flex items-center justify-between ">
                  <span>Sub Total</span>
                  <span>{formatCurrency(subTotal)}</span>
                </div>

                <div className="flex items-center justify-between ">
                  <span>Discount</span>
                  <span>{formatCurrency(discount)}</span>
                </div>

                <div className="flex items-center justify-between ">
                  <span>Grand Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>

                <Button
                  className="w-full"
                  onClick={handleConfirmOrder}
                  disabled={isConfirmingOrder || !selectedAddressId}
                >
                  {isConfirmingOrder ? "Confirming..." : "Confirm Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Invoice data={order} />
      )}
    </div>
  );
}
