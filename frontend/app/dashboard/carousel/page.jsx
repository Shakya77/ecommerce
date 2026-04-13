"use client";

import { DataTable } from "@/components/DataTable";
import { fetcher } from "@/constants";
import { toImageUrl } from "@/lib/image";
import React from "react";
import useSWR from "swr";

export default function page() {
  const query = `/carousel`;

  const { data, isLoading } = useSWR(query, fetcher);

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
          className="h-12 w-12 rounded-full object-cover"
        />
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <DataTable columns={columns} data={data} isLoading={isLoading} />;
}
