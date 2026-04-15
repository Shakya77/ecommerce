"use client";

import ComboBoxPopupComponent from "@/components/dashboard/product/ComboBoxPopupComponent";
import ProductImageManager from "@/components/dashboard/product/ProductImageManager";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import JoditEditor from "jodit-react";
import { ArrowLeftIcon } from "lucide-react";
import { postProduct } from "@/services/dashboard.http";

export default function ProductForm({ mode = "create", productId = null }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);
  const [addMore, setAddMore] = useState(false);
  const editor = useRef(null);
  const [content, setContent] = useState("");

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
        setPrice(product.price?.toString() || "");
        setCategoryIds(
          (product.productCategories || []).map((item) => item.id),
        );
        setExistingImages(product.medias || []);
        setContent(product.description || "");
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
      formData.append("description", content);
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
        await postProduct(formData);
        toast.success("Product created successfully");
      }

      if (addMore) {
        setName("");
        setPrice("");
        setContent("");
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

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "|",
        "image",
        "link",
        "|",
        "align",
        "undo",
        "redo",
      ],
      height: 400,
    }),
    [],
  );

  const handleBlur = useCallback((newContent) => {
    setContent(newContent);
  }, []);

  const handleChange = useCallback((newContent) => {
    setContent(newContent);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Button
        onClick={() => router.push("/dashboard/product")}
        variant="outline"
        className="max-w-max mb-4"
      >
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Back
      </Button>
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
            <JoditEditor
              ref={editor}
              value={content}
              config={config}
              tabIndex={1}
              onBlur={handleBlur}
              onChange={handleChange}
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
    </>
  );
}
