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
import { getUserOrderById } from "@/services/website.http";
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

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getUserOrderById(orderId);

        if (!data) {
          toast.error("Order not found");
          setOrder(null);
          return;
        }

        setOrder(data);
      } catch (error) {
        console.error("Failed to load order details:", error);
        toast.error("Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

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
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard?tab=orders">Back to Orders</Link>
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant[order.status] || "secondary"}>
            {order.status}
          </Badge>
          <Button size="sm" onClick={() => window.print()}>
            Print Invoice
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none">
        <CardHeader className="border-b pb-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <CardTitle className="text-2xl tracking-tight">
                Tax Invoice
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
                <span className="font-medium">Issued On:</span>{" "}
                {formatDate(order.createdAt)}
              </p>
              <p>
                <span className="font-medium">Status:</span> {order.status}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md border p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                From
              </p>
              <p className="mt-2 text-sm font-medium">Ecommerce Store</p>
              <p className="text-sm text-muted-foreground">
                Online Sales Department
              </p>
            </div>

            <div className="rounded-md border p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Bill To
              </p>
              <p className="mt-2 text-sm font-medium">
                Customer #{order.userId}
              </p>
              <p className="text-sm text-muted-foreground">
                Account-linked billing
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Item</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Line Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map((item) => {
                  const product = item.getProduct || {};
                  const quantity = Number(item?.quantity || 0);
                  const price = Number(item?.price || 0);
                  const subtotal = price * quantity;

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 overflow-hidden rounded-md border bg-muted/20">
                            {product.medias?.[0]?.path ? (
                              <img
                                src={toImageUrl(product.medias[0].path)}
                                alt={product.name || "Product image"}
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="space-y-0.5">
                            <p className="font-medium">
                              {product.name || "Unknown item"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              SKU: {product.slug || "N/A"}
                            </p>
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
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">{formatCurrency(0)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium">{formatCurrency(0)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Grand Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            This is a system-generated invoice and serves as your purchase bill.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
