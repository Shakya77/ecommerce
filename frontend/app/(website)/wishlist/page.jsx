"use client";

import Loader from "@/components/Loader";
import WishLists from "@/components/website/wishlist/WishLists";
import { fetcher } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RequireAuthDialog } from "@/components/website/RequireAuthDialog";

export default function page() {
  const [open, setOpen] = useState(false);

  const { isAuthenticated, loading } = useAuth();

  const shouldFetch = !loading && isAuthenticated;

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? "/wishlist" : null,
    fetcher,
  );

  useEffect(() => {
    document.title = "Wishlist - E-commerce";
  }, []);

  if (isLoading) return <Loader />;

  return (
    <>
      <h1 className="text-2xl font-bold mt-6">My Wishlist</h1>
      {!loading && !isAuthenticated ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Heart />
            </EmptyMedia>
            <EmptyTitle>Wishlist </EmptyTitle>
            <EmptyDescription>
              Please Login in order to view your wishlist.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Link href="/products">Browse Products</Link>
              </Button>

              <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                Login
              </Button>
              <RequireAuthDialog
                open={open}
                onOpenChange={setOpen}
                action={"wishlist"}
              />
            </div>
          </EmptyContent>
        </Empty>
      ) : (
        <WishLists data={data} mutate={mutate} />
      )}
    </>
  );
}
