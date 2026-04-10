"use client";

import ComboBoxPopupComponent from "@/components/dashboard/product/ComboBoxPopupComponent";
import ProductImageManager from "@/components/dashboard/product/ProductImageManager";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProductForm({ mode = "create", productId = null }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);
  const [addMore, setAddMore] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !productId) {
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        const response = await api.get(`/product/${productId}`);
        const product = response.data;

        setName(product.name || "");
        setDescription(product.description || "");
        setPrice(product.price?.toString() || "");
        setCategoryIds((product.categories || []).map((item) => item.id));
        setExistingImages(product.medias || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [mode, productId]);

  const submit = async (event) => {
    event.preventDefault();

    if (!categoryIds.length) {
      toast.error("Please select at least one category");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("categories", JSON.stringify(categoryIds));

      if (mode === "edit") {
        formData.append(
          "keepMediaIds",
          JSON.stringify(existingImages.map((image) => image.id)),
        );
      }

      newFiles.forEach((file) => {
        formData.append("files", file);
      });

      if (mode === "edit") {
        await api.patch(`/product/${productId}`, formData);
        toast.success("Product updated successfully");
      } else {
        await api.post("/product", formData);
        toast.success("Product created successfully");
      }

      if (addMore) {
        setName("");
        setDescription("");
        setPrice("");
        setCategoryIds([]);
        setExistingImages([]);
        setNewFiles([]);
      } else {
        router.push("/dashboard/product");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading product...</p>;
  }

  return (
    <form onSubmit={submit} className="w-full max-w-4xl space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="productName">Product Name</FieldLabel>
          <Input
            id="productName"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Awesome Product"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="productDescription">Description</FieldLabel>
          <Textarea
            id="productDescription"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Product description"
            rows={4}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="categories">Categories</FieldLabel>
          <ComboBoxPopupComponent
            value={categoryIds}
            onChange={setCategoryIds}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="price">Price</FieldLabel>
          <Input
            id="price"
            type="number"
            min={0}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="999"
            required
          />
        </Field>
      </FieldGroup>

      <ProductImageManager
        existingImages={existingImages}
        onRemoveExisting={(id) =>
          setExistingImages((prev) => prev.filter((image) => image.id !== id))
        }
        newFiles={newFiles}
        onFilesChange={setNewFiles}
        disabled={submitting}
      />

      <Field orientation="horizontal" className="justify-end gap-3">
        {mode === "create" && (
          <Field orientation="horizontal">
            <Checkbox
              id="add-checkbox"
              checked={addMore}
              onCheckedChange={(checked) => setAddMore(checked)}
            />
            <FieldLabel htmlFor="add-checkbox">Add More</FieldLabel>
          </Field>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/product")}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting
            ? mode === "edit"
              ? "Updating..."
              : "Creating..."
            : mode === "edit"
              ? "Update Product"
              : "Create Product"}
        </Button>
      </Field>
    </form>
  );
}
