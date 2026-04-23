"use client";
import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const initialForm = {
  address: "",
  city: "",
  state: "",
};

export default function Address() {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/address");
      setAddresses(data);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim()
    ) {
      toast.error("Address, city, and state are required");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
      };

      if (editingId) {
        await api.patch(`/address/${editingId}`, payload);
        fetchAddresses();

        toast.success("Address updated successfully");
      } else {
        const { data } = await api.post("/address", payload);
        fetchAddresses();
        toast.success(data?.message || "Address added successfully");
      }

      resetForm();
      await fetchAddresses();
    } catch (error) {
      console.error("Failed to save address:", error);
      toast.error(error?.response?.data?.message || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      address: item.address || "",
      city: item.city || "",
      state: item.state || "",
    });
  };

  const openDeleteDialog = (item) => {
    setAddressToDelete(item);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!addressToDelete?.id) return;

    try {
      setIsSubmitting(true);
      await api.delete(`/address/${addressToDelete.id}`);
      toast.success("Address deleted successfully");
      if (editingId === addressToDelete.id) {
        resetForm();
      }
      setIsDeleteOpen(false);
      setAddressToDelete(null);
      await fetchAddresses();
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast.error("Failed to delete address");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">Address Book</h1>
        <p className="text-sm text-muted-foreground">
          Add, update, and manage your saved addresses.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-md border p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(event) => updateField("address", event.target.value)}
              placeholder="Bhagwati Marga"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(event) => updateField("city", event.target.value)}
              placeholder="Nepal"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(event) => updateField("state", event.target.value)}
              placeholder="Koshi"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {editingId ? (
              isSubmitting ? (
                "Updating..."
              ) : (
                "Update Address"
              )
            ) : isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Plus className="size-4" />
                Add Address
              </>
            )}
          </Button>

          {editingId ? (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel Edit
            </Button>
          ) : null}
        </div>
      </form>

      <Separator />

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading && addresses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No addresses added yet.
                </TableCell>
              </TableRow>
            ) : null}

            {addresses.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{item.address}</TableCell>
                <TableCell>{item.city}</TableCell>
                <TableCell>{item.state}</TableCell>
                <TableCell>
                  <Badge variant={item.isActive ? "secondary" : "outline"}>
                    {item.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleEdit(item)}
                      aria-label={`Edit address ${item.id}`}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openDeleteDialog(item)}
                      aria-label={`Delete address ${item.id}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading addresses...
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete address?</DialogTitle>
            <DialogDescription>
              This will remove the selected address from your address book.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
