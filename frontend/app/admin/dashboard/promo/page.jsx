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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  const [mode, setMode] = useState("add");
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [selectedType, setSelectedType] = useState("amount");
  const [openStatus, setOpenStatus] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      promoType: "amount",
      code: "",
      value: 0,
    },
  });

  const query = `/promo`;

  const { data, error, isLoading, mutate } = useSWR(query, fetcher);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    if (!newOpen) {
      setMode("add");
      setId(null);
      setSelectedType("amount");
      reset({
        title: "",
        promoType: "amount",
        code: "",
        value: 0,
      });
    }
  };

  const remove = async (id) => {
    try {
      const response = await api.delete(`/promo/${id}`);

      toast.success(response.data.message || "Promo deleted successfully");
      mutate();
    } catch (error) {
      console.error("Error deleting promo:", error);
      toast.error(error.response?.data?.message || "Failed to delete promo");
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      title: data.title,
      promoType: selectedType,
      code: data.code,
      value: parseInt(data.value),
    };

    try {
      let response;
      if (mode === "edit") {
        response = await api.patch(`/promo/${id}`, payload);
        toast.success(response.data.message || "Promo updated successfully");
      } else {
        response = await api.post(`/promo`, payload);
        toast.success(response.data.message || "Promo created successfully");
      }

      reset({
        title: "",
        promoType: "amount",
        code: "",
        value: 0,
      });
      setSelectedType("amount");
      setOpen(false);
      setMode("add");
      setId(null);

      mutate();
    } catch (error) {
      console.error("Error saving promo:", error);
      toast.error(error.response?.data?.message || "Failed to save promo");
    }
  };

  const edit = async (id) => {
    setId(id);
    setMode("edit");

    try {
      const response = await api.get(`/promo/${id}`);
      setValue("title", response.data.title);
      setValue("code", response.data.code);
      setValue("value", response.data.value);
      setSelectedType(response.data.promoType);
      setOpen(true);
    } catch (error) {
      console.error("Error editing promo:", error);
      toast.error(error.response?.data?.message || "Failed to load promo");
    }
  };

  const onStatus = async (id) => {
    try {
      const response = await api.patch(`/promo/status/${id}`);
      toast.success(response.data.message);
      mutate();
    } catch (error) {
      console.error("Error changing promo status:", error);
      toast.error(
        error.response?.data?.message || "Failed to change promo status",
      );
    } finally {
      setSelectedRow(null);
    }
  };

  const columns = [
    {
      header: "SN",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => <span className="">{row.original.code}</span>,
    },
    {
      accessorKey: "promoType",
      header: "Type",
      cell: ({ row }) => (
        <span className="capitalize">
          {row.original.promoType === "amount" ? "Fixed Amount" : "Percentage"}
        </span>
      ),
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => (
        <span>
          {row.original.promoType === "amount"
            ? `Rs ${row.original.value}`
            : `${row.original.value}%`}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          onClick={() => {
            setSelectedRow(row.original);
            setOpenStatus(true);
          }}
          className="cursor-pointer"
        >
          <Badge variant={row.original.isActive ? "default" : "secondary"}>
            {row.original.isActive ? "Active" : "Inactive"}
          </Badge>
        </Button>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const promo = row.original;

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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => edit(promo.id)}>
                <Edit />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => remove(promo.id)}
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

  if (error) return <p>Failed to load promos.</p>;

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild onClick={() => setOpen(true)}>
          <Button variant="outline" className="w-fit">
            Create Promo
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {mode === "edit" ? "Edit Promo" : "Create Promo"}
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="new year sale"
                  {...register("title", {
                    required: "Title is required.",
                  })}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </Field>
              <Field>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  placeholder="NEWYEAR2083"
                  {...register("code", {
                    required: "Code is required.",
                  })}
                />
                {errors.code && (
                  <p className="text-sm text-destructive">
                    {errors.code.message}
                  </p>
                )}
              </Field>
              <Field>
                <Label htmlFor="type">Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amount">Fixed Amount</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <Label htmlFor="value">
                  Value {selectedType === "percentage" && "(%)"}
                </Label>
                <Input
                  id="value"
                  type="number"
                  placeholder={selectedType === "percentage" ? "20" : "10"}
                  {...register("value", {
                    required: "Value is required.",
                    valueAsNumber: true,
                  })}
                />
                {errors.value && (
                  <p className="text-sm text-destructive">
                    {errors.value.message}
                  </p>
                )}
              </Field>
            </FieldGroup>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={openStatus} onOpenChange={setOpenStatus}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
          </DialogHeader>

          <p>
            Are you sure you want to mark this user as{" "}
            <b>{selectedRow?.isActive ? "Inactive" : "Active"}</b>?
          </p>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setOpenStatus(false)}>
              Cancel
            </Button>

            <Button
              onClick={async () => {
                try {
                  await onStatus(selectedRow.id);
                  setOpenStatus(false);
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DataTable columns={columns} data={data} isLoading={isLoading} />
    </>
  );
}
