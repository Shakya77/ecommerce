"use client";
import ComboBoxPopupComponent from "@/components/dashboard/product/ComboBoxPopupComponent";
import FileUpload01 from "@/components/file-upload-01";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";


export default function Page() {
  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full max-w-3xl">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="productName">Product Name</FieldLabel>
            <Input
              id="productName"
              type="text"
              placeholder="Awesome Product"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="categories">Categories</FieldLabel>
            <ComboBoxPopupComponent />
          </Field>

          <Field>
            <FieldLabel htmlFor="price">Price</FieldLabel>
            <Input id="price" type="number" placeholder="999" />
          </Field>

          <Field orientation="horizontal" className="justify-end gap-3">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </Field>
        </FieldGroup>
      </form>
      <FileUpload01 />
    </>
  );
}
