"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { QuantityInput } from "@/components/QuantityInput";
import WishlistButton from "@/components/WishlistButton";
import DeleteButton from "@/components/DeleteButton";

export default function CartCard({ data }) {
  const [checked, setChecked] = useState(false);
  const [quantity, setQuantity] = useState(data?.quantity);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <Card>
      <CardContent>
        <div className="flex gap-4">
          <div className="flex justify-center items-center">
            <Checkbox
              checked={checked}
              onCheckedChange={setChecked}
              className="w-5 h-5"
            />
          </div>
          <div className="relative w-20 h-20 md:w-28 md:h-28 shrink-0 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
            <img
              src=""
              alt=""
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-base font-semibold line-clamp-1 w-96">
                {data.getProduct?.name}
              </h3>
              <p className="text-sm text-gray-500">
                {data.getProduct.productCategories
                  .map((pc) => pc.category.name)
                  .join(", ")}
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">
                  Rs. {data.getProduct.price}
                </p>
              </div>
            </div>

            <div className="">
              <QuantityInput value={quantity} onChange={setQuantity} />
              <div className="flex gap-2 justify-end mt-3">
                <DeleteButton />

                <WishlistButton
                  isWishlisted={isWishlisted}
                  onToggle={setIsWishlisted}
                  variant="ghost"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
