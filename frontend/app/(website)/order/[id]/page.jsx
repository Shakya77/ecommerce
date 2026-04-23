"use client";

import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";
import formatDate from "@/lib/date";
import { toImageUrl } from "@/lib/image";
import { getUserAddress, getUserOrderById } from "@/services/website.http";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const statusVariant = {
  PENDING: "outline",
  COMPLETED: "secondary",
  CANCELLED: "destructive",
};

export default function page() {
  const params = useParams();
  const orderId = params?.id;
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);

  const orderItems = useMemo(() => {
    return Array.isArray(order?.orderItems) ? order.orderItems : [];
  }, [order]);

  const grandTotal = useMemo(() => {
    return orderItems.reduce((sum, item) => {
      const quantity = Number(item?.quantity || 0);
      const price = Number(item?.price || 0);
      return sum + quantity * price;
    }, 0);
  }, [orderItems]);

  const totalItems = useMemo(() => {
    return orderItems.reduce(
      (sum, item) => sum + Number(item?.quantity || 0),
      0,
    );
  }, [orderItems]);

  const formatCurrency = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString()}`;

  const selectedAddress = useMemo(() => {
    return (
      addresses.find((address) => address.id === selectedAddressId) || null
    );
  }, [addresses, selectedAddressId]);

  const orderAddress = useMemo(() => {
    const orderAddressId = Number(order?.addressId || 0);
    return (
      addresses.find((address) => address.id === orderAddressId) ||
      selectedAddress ||
      null
    );
  }, [addresses, order?.addressId, selectedAddress]);

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
        status: "COMPLETED",
      };

      const { data } = await api.patch(`/order/${order.id}`, payload);

      toast.success(data?.message || "Order confirmed successfully");

      router.refresh();
    } catch (error) {
      console.error("Failed to confirm order:", error);
      toast.error(error?.response?.data?.message || "Failed to confirm order");
    } finally {
      setIsConfirmingOrder(false);
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
                    <span>{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
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
        <Card className="print:shadow-none">
          <CardHeader className="border-b pb-6">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <CardTitle className="text-2xl tracking-tight">
                  Estimated Invoice
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Thank you for your order.
                </p>
              </div>

              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Invoice #:</span> INV-{order.id}
                </p>
                <p>
                  <span className="font-medium">Order #:</span> {order.id}
                </p>
                <p>
                  <span className="font-medium">Issued On:</span>
                  {formatDate(order.createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Badge
                    variant={statusVariant[order.status] || "outline"}
                    className="text-[10px]"
                  >
                    {order.status}
                  </Badge>
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="rounded-md border p-4 text-sm">
              <p className="font-medium">Shipping Address</p>
              {orderAddress ? (
                <p className="mt-1 text-muted-foreground">
                  {orderAddress.address}, {orderAddress.city},
                  {` ${orderAddress.state}`}
                </p>
              ) : (
                <p className="mt-1 text-muted-foreground">
                  Address information not available.
                </p>
              )}
            </div>

            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Item</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => {
                    const product = item.getProduct || {};
                    const quantity = Number(item?.quantity || 0);
                    const price = Number(item?.price || 0);
                    const subtotal = price * quantity;
                    const productName =
                      product?.name || `Product #${item.productId}`;

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-14 w-14 overflow-hidden rounded-md border bg-muted/20">
                              {product.medias?.[0]?.path ? (
                                <img
                                  src={toImageUrl(product.medias[0].path)}
                                  alt={productName}
                                  className="h-full w-full object-cover"
                                />
                              ) : null}
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-medium">
                                {productName.slice(0, 50)}
                                {productName.length > 50 ? "..." : ""}
                              </p>
                              <span className="flex flex-wrap gap-1">
                                {(product.productCategories || []).map((pc) => (
                                  <Badge key={pc.id} variant="secondary">
                                    {pc?.category?.name}
                                  </Badge>
                                ))}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(price)}
                        </TableCell>
                        <TableCell className="text-right">{quantity}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(subtotal)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="ml-auto w-full max-w-sm space-y-2 rounded-md border p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Quantity</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Grand Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
