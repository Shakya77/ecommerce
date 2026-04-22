"use client";

import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/constants";
import formatDate from "@/lib/date";
import Link from "next/link";
import { useMemo } from "react";
import useSWR from "swr";

const statusVariant = {
  PENDING: "outline",
  COMPLETED: "secondary",
  CANCELLED: "destructive",
};

export default function Page() {
  const { data, error, isLoading } = useSWR("/order", fetcher);

  const columns = [
    {
      header: "SN",
      cell: ({ row }) => row.index + 1,
    },
    {
      id: "orderId",
      header: "Order ID",
      cell: ({ row }) => `#${row.original.id}`,
    },
    {
      id: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const user = row.original?.getUser;
        return user?.name || user?.email || "N/A";
      },
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
        const orderItems = Array.isArray(row.original?.orderItems)
          ? row.original.orderItems
          : [];
        const count = orderItems.reduce((sum, item) => {
          return sum + Number(item?.quantity || 0);
        }, 0);

        return `${count} item${count === 1 ? "" : "s"}`;
      },
    },
    {
      id: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const orderItems = Array.isArray(row.original?.orderItems)
          ? row.original.orderItems
          : [];

        const fallbackTotal = orderItems.reduce((sum, item) => {
          const quantity = Number(item?.quantity || 0);
          const price = Number(item?.price || 0);
          return sum + quantity * price;
        }, 0);

        const total = Number(row.original?.totalAmount ?? fallbackTotal);

        return `Rs. ${total.toLocaleString()}`;
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = String(row.original?.status || "PENDING").toUpperCase();
        return (
          <Badge variant={statusVariant[status] || "outline"}>{status}</Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <Button variant="outline" size="sm" asChild>
            <Link
              href="admin/dashboard/orders/[id]"
              as={`/admin/dashboard/orders/${row.original.id}`}
            >
              View
            </Link>
          </Button>
        );
      },
    },
  ];

  if (error) {
    return <p>Failed to load orders.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Orders</h2>
      </div>

      <DataTable columns={columns} data={data} isLoading={isLoading} />
    </div>
  );
}
