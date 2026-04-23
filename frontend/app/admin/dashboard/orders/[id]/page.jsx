"use client";

import Invoice from "@/components/invoice";
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

      <Invoice data={order} />
    </div>
  );
}
