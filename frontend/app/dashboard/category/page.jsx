"use client";

import { DataTable } from "@/components/DataTable";
import Loader from "@/components/Loader";
import { fetcher } from "@/constants";
import useSWR from "swr";
import { Delete, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";

export default function Page() {
  const query = `/category`;

  const { data, error, isLoading, mutate } = useSWR(query, fetcher);

  const rows = data?.data ?? [];

  const remove = async (id) => {
    try {
      const response = await api.delete(`/category/${id}`);

      toast.success(response.data.message);
      mutate();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.response?.data?.message);
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
      accessorKey: "slug",
      header: "Slug",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (row.original.isActive ? "Active" : "Inactive"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const category = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => remove(category.id)}
                className="text-destructive hover:text-destructive"
              >
                <Delete />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) return <Loader />;

  if (error) return <p>Failed to load categories.</p>;

  return <DataTable columns={columns} data={rows} />;
}
