"use client";

import { DataTable } from "@/components/DataTable";
import Loader from "@/components/Loader";
import { fetcher } from "@/constants";
import useSWR from "swr";
import { Delete, Edit, MoreHorizontal } from "lucide-react";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function Page() {
  const [mode, setMode] = useState("add");
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write something...",

      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "link",
        "|",
        "undo",
        "redo",
      ],

      toolbarAdaptive: false,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
    }),
    [],
  );

  const query = `/category`;

  const { data, error, isLoading, mutate } = useSWR(query, fetcher);

  const rows = data?.data ?? [];

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    if (!newOpen) {
      setMode("add");
      setId(null);
      setContent("");
      reset({ name: "" });
    }
  };

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

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      description: content,
    };

    try {
      let response;
      if (mode === "edit") {
        response = await api.put(`/category/${id}`, payload);
        toast.success(response.data.message || "Category updated successfully");
      } else {
        response = await api.post(`/category`, payload);
        toast.success(response.data.message || "Category created successfully");
      }

      reset({ name: "" });
      setContent("");
      setOpen(false);
      setMode("add");
      setId(null);

      mutate();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(error.response?.data?.message || "Failed to save category");
    }
  };

  const edit = async (id) => {
    setId(id);
    setMode("edit");

    try {
      const response = await api.get(`/category/${id}`);
      setContent(response.data.description);
      setValue("name", response.data.name);
      setContent(response.data.description || "");
      setOpen(true);
    } catch (error) {
      console.error("Error editing category:", error);
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

  if (error) return <p>Failed to load categories.</p>;

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild onClick={() => setOpen(true)}>
          <Button variant="outline" className="w-fit">
            Create Category
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-5xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new category.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue="Pedro Duarte"
                  {...register("name", {
                    required: "Name is required.",
                  })}
                />
              </Field>
              <Field>
                <Label htmlFor="description-1">Description</Label>
                <JoditEditor
                  id="description"
                  value={content}
                  config={config}
                  onBlur={(newContent) => setContent(newContent)}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <DataTable columns={columns} data={rows} isLoading={isLoading} />
    </>
  );
}
