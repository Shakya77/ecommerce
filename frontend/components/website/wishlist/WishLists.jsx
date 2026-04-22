import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import WishListCard from "./WishListCard";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WishLists({ data, mutate }) {
  if (data.length === 0) {
    return (
      <Empty className="border border-dashed mt-3">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Heart />
          </EmptyMedia>
          <EmptyTitle>Wishlist Empty</EmptyTitle>
          <EmptyDescription>
            You haven't added any products to your wishlist yet. Start exploring
            our amazing products and add them to your wishlist!
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="sm">
            <Link href="/products">Browse Products</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mt-6">
      {data?.map((item) => (
        <WishListCard key={item.id} data={item} mutate={mutate} />
      ))}
    </div>
  );
}
