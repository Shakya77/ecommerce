"use client";

import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import formatDate from "@/lib/date";
import { toImageUrl } from "@/lib/image";
import { getUserAddress, getUserOrderById } from "@/services/website.http";
import Link from "next/link";
import { useParams } from "next/navigation";
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

  const [order, setOrder] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const orderAddress = useMemo(() => {
    const orderAddressId = Number(order?.addressId || 0);
    return addresses.find((address) => address.id === orderAddressId) || null;
  }, [addresses, order?.addressId]);

  useEffect(() => {
    const loadData = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const orderData = await getUserOrderById(orderId);

        setOrder(orderData);
      } catch (error) {
        console.error("Failed to load order data:", error);
        toast.error("Failed to load order data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [orderId]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm">
        <Link href="/admin/dashboard/orders">Back to Orders</Link>
      </Button>

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
              <span className="font-medium">{formatCurrency(grandTotal)}</span>
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
    </div>
  );
}
