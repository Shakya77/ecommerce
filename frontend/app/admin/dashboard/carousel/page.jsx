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
import { toImageUrl } from "@/lib/image";
import { Delete, Edit, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import useSWR from "swr";

export default function page() {
  const query = `/carousel`;
  const router = useRouter();
  const { data, isLoading, mutate } = useSWR(query, fetcher);

  const columns = [
    {
      header: "SN",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "label",
      header: "Label",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div
          className="rich-text-content"
          dangerouslySetInnerHTML={{
            __html: row.original.description || "No description",
          }}
        />
      ),
    },
    {
      accessorKey: "imageUrl",
      header: "Image",
      cell: ({ row }) => (
        <img
          src={toImageUrl(row.original.imageUrl)}
          alt={row.original.label}
          className="h-12 w-12  object-cover"
        />
      ),
    },
    {
      header: "Actions",
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

              <DropdownMenuItem
                onClick={() => edit(category.id)}
                className="text-destructive hover:text-destructive"
              >
                <Edit />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const edit = async (id) => {
    router.push(`/admin/dashboard/carousel/${id}/edit`);
  };

  const remove = async (id) => {
    try {
      const data = await api.delete(`/carousel/${id}`);
      mutate();
      toast.success("Carousel deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Link href="/admin/dashboard/carousel/create">
        <Button variant="outline">
          <Plus />
          Create
        </Button>
      </Link>
      <DataTable columns={columns} data={data} isLoading={isLoading} />
    </>
  );
}
