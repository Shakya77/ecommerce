"use client";

import { SingleImageManager } from "@/components/dashboard/product/ProductImageManager";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Form() {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [newFiles, setNewFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newFiles.length) {
      toast.error("Please select one carousel image");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("label", label);
      formData.append("description", description);
      formData.append("imageUrl", "");
      formData.append("files", newFiles[0]);

      await api.post("/carousel", formData);
      toast.success("Carousel created successfully");

      router.push("/dashboard/carousel");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create carousel");
    } finally {
      setSubmitting(false);
    }
  };

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
            {submitting ? "Saving..." : "Create Carousel"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
