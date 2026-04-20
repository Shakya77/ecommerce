"use client";

import { SingleImageManager } from "@/components/admin/dashboard/product/ProductImageManager";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loader from "@/components/Loader";

export default function Form({ mode, carouselId }) {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [existingImage, setExistingImage] = useState(null);
  const [newFiles, setNewFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode !== "edit" || !carouselId) {
      setLoading(false);
      return;
    }

    const loadCarousel = async () => {
      try {
        const response = await api.get(`/carousel/${carouselId}`);
        const carousel = response.data;

        setLabel(carousel.label || "");
        setDescription(carousel.description || "");
        setExistingImage(
          carousel.imageUrl
            ? {
                id: carousel.id,
                path: carousel.imageUrl,
                filename: carousel.label || "Current image",
              }
            : null,
        );
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load carousel");
      } finally {
        setLoading(false);
      }
    };

    loadCarousel();
  }, [mode, carouselId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const fileToUpload = newFiles[0] || null;

    if (mode === "create" && !fileToUpload) {
      toast.error("Please select one carousel image");
      return;
    }

    if (mode === "edit" && !fileToUpload && !existingImage) {
      toast.error("Please keep or select one carousel image");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("label", label);
      formData.append("description", description);

      if (fileToUpload) {
        formData.append("files", fileToUpload);
      } else if (existingImage) {
        formData.append("imageUrl", existingImage.path);
      }

      if (mode === "edit") {
        await api.patch(`/carousel/${carouselId}`, formData);
        toast.success("Carousel updated successfully");
      } else {
        await api.post("/carousel", formData);
        toast.success("Carousel created successfully");
      }

      router.push("/admin/dashboard/carousel");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save carousel");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="carousel-label">Label</FieldLabel>
          <Input
            id="carousel-label"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Summer Collection"
            required
            disabled={submitting}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="carousel-description">Description</FieldLabel>
          <Textarea
            id="carousel-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Short text for this carousel slide"
            rows={3}
            disabled={submitting}
          />
        </Field>

        <Field>
          <FieldLabel>Carousel Image</FieldLabel>
          <SingleImageManager
            existingImages={
              mode === "edit" && existingImage ? [existingImage] : []
            }
            onRemoveExisting={
              mode === "edit" ? () => setExistingImage(null) : undefined
            }
            newFiles={newFiles}
            onFilesChange={setNewFiles}
            disabled={submitting}
          />
        </Field>

        <Field orientation="horizontal" className="justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/carousel")}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting
              ? "Saving..."
              : mode === "edit"
                ? "Update Carousel"
                : "Create Carousel"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
