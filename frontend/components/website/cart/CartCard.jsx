"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { QuantityInput } from "@/components/QuantityInput";
import DeleteButton from "@/components/DeleteButton";
import { toImageUrl } from "@/lib/image";

export default function CartCard({
  data,
  checked,
  onCheckedChange,
  quantity,
  onQuantityChange,
  onDelete,
}) {
  return (
    <Card className="rounded-sm">
      <CardContent>
        <div className="flex gap-4">
          <div className="flex justify-center items-center">
            <Checkbox
              checked={checked}
              onCheckedChange={(value) => onCheckedChange?.(Boolean(value))}
              className="w-5 h-5"
            />
          </div>
          <div className="relative w-20 h-20 md:w-28 md:h-28 shrink-0  overflow-hidden">
            <img
              src={toImageUrl(data.getProduct.medias[0]?.path)}
              alt={data.getProduct.name}
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          <div className="flex-1 flex flex-col md:flex-row  md:justify-between gap-3 ">
            <div className="space-y-1">
              <h3 className="text-base font-semibold line-clamp-1 w-96">
                {data.getProduct?.name}
              </h3>
              <p className="text-sm text-gray-500">
                {data.getProduct.productCategories
                  .map((pc) => pc.category.name)
                  .join(", ")}
              </p>

              <p className="text-xl font-bold text-gray-900">
                Rs. {data.getProduct.price}
              </p>
            </div>

            <div className="">
              <QuantityInput value={quantity} onChange={onQuantityChange} />
              <div className="flex gap-2 justify-end mt-3">
                <DeleteButton onDelete={onDelete} confirm />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
