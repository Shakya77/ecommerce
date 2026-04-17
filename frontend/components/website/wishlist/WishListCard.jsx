"use client";

import { Trash2, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toImageUrl } from "@/lib/image";
import { onAddToCart } from "@/services/website.http";

export default function WishListCard({ data }) {
  return (
    <Card>
      <CardContent>
        <div className="flex gap-4">
          <div className="relative w-24 h-24 md:w-28 md:h-28 shrink-0 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
            <img
              src={toImageUrl(data.getProduct.medias[0].path)}
              alt={data.getProduct.name}
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 96px, 112px"
            />
          </div>

          <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-base font-semibold line-clamp-1 w-96">
                {data.getProduct.name}
              </h3>
              <p className="text-sm text-gray-500">Electronics & Wearables</p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  Rs. {data.getProduct.price}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => onAddToCart(data.getProduct.id)}
                  className="group/btn relative overflow-hidden transition-all duration-300 hover:border-blue-500 hover:bg-blue-50"
                >
                  <ShoppingCart className="w-4 h-4 mr-2 transition-transform group-hover/btn:scale-110" />
                  <span className="text-sm">Add to Cart</span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
