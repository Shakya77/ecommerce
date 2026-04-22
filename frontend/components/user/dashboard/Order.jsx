"use client";

import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import formatDate from "@/lib/date";
import { getUserOrders } from "@/services/website.http";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const statusVariant = {
  PENDING: "outline",
  COMPLETED: "secondary",
  CANCELLED: "destructive",
};

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "ALL" ? true : order.status === statusFilter;

      const orderDate = new Date(order.createdAt);
      const from = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
      const to = toDate ? new Date(`${toDate}T23:59:59`) : null;

      const matchesFromDate = from ? orderDate >= from : true;
      const matchesToDate = to ? orderDate <= to : true;

      return matchesStatus && matchesFromDate && matchesToDate;
    });
  }, [orders, statusFilter, fromDate, toDate]);

  const columns = useMemo(
    () => [
      {
        id: "id",
        header: "Order ID",
        cell: ({ row }) => (
          <Link
            href={`/order/${row.original.id}`}
            className="font-medium underline-offset-4 hover:underline"
          >
            #{row.original.id}
          </Link>
        ),
      },
      {
        id: "date",
        header: "Date",
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        id: "items",
        header: "Items",
        cell: ({ row }) => {
          const count = Array.isArray(row.original.orderItems)
            ? row.original.orderItems.length
            : 0;
          return `${count} item${count > 1 ? "s" : ""}`;
        },
      },
      {
        id: "total",
        header: "Total",
        cell: ({ row }) => {
          const orderItems = Array.isArray(row.original.orderItems)
            ? row.original.orderItems
            : [];
          const total = orderItems.reduce((sum, item) => {
            const quantity = Number(item?.quantity || 0);
            const price = Number(item?.price || 0);
            return sum + quantity * price;
          }, 0);

          return `Rs. ${total}`;
        },
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={statusVariant[row.original.status] || "secondary"}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: "details",
        header: "",
        cell: ({ row }) => (
          <Link
            href={`/order/${row.original.id}`}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            View
          </Link>
        ),
      },
    ],
    [],
  );

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await getUserOrders();

      if (!Array.isArray(data)) {
        setOrders([]);
        return;
      }

      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Track your checkout history and order status.
        </p>
      </div>

      <div className="grid gap-3 rounded-md border p-3 md:grid-cols-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">Status</p>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium">From Date</p>
          <Input
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
          />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium">To Date</p>
          <Input
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
          />
        </div>
      </div>

      {!isLoading && filteredOrders.length === 0 ? (
        <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          No orders match your current filters.
        </div>
      ) : null}

      <DataTable
        columns={columns}
        data={filteredOrders}
        isLoading={isLoading}
      />
    </div>
  );
}
