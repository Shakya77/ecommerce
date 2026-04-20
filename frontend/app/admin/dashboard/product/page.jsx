"use client";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetcher } from "@/constants";
import api from "@/lib/api";
import { Delete, Edit, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export default function Page() {
  const { data, error, isLoading, mutate } = useSWR("/product", fetcher);

  const rows = useMemo(() => data?.data ?? [], [data]);

  const remove = async (id) => {
    try {
      const response = await api.delete(`/product/${id}`);
      toast.success(response.data.message || "Product deleted successfully");
      mutate();
    } catch (deleteError) {
      toast.error(
        deleteError.response?.data?.message || "Failed to delete product",
      );
    }
  };

  const columns = [
    {
      header: "SN",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => `Rs.${Number(row.original.price).toLocaleString()}`,
    },
    {
      accessorKey: "categories",
      header: "Categories",
      cell: ({ row }) =>
        (row.original.categories || [])
          .map((category) => category.name)
          .join(", "),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/dashboard/product/${row.original.id}/edit`}>
                <Edit />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => remove(row.original.id)}
              className="text-destructive hover:text-destructive"
            >
              <Delete />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (error) {
    return <p>Failed to load products.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Products</h2>
        <Button asChild>
          <Link href="/admin/dashboard/product/create">
            <Plus />
            Create Product
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={rows} isLoading={isLoading} />
    </div>
  );
}
