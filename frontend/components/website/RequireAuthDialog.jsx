"use client";

import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ACTION_COPY = {
  cart: {
    title: "Sign in required",
    description: "Please sign in to add items to your cart.",
  },
  wishlist: {
    title: "Sign in required",
    description: "Please sign in to save items to your wishlist.",
  },
};

export function RequireAuthDialog({ open, onOpenChange, action = "cart" }) {
  const copy = ACTION_COPY[action] ?? ACTION_COPY.cart;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-xl p-6">
        <DialogHeader className="space-y-2 text-center">
          <DialogTitle className="text-lg font-semibold">
            {copy.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {copy.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-4">
          <Button asChild className="w-full">
            <Link href="/login">
              <LogIn className="mr-2 size-4" />
              Sign in
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href="/signup">
              <UserPlus className="mr-2 size-4" />
              Create account
            </Link>
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Maybe later
          </Button>
        </div>

        <DialogFooter className="pt-2 text-center text-xs text-muted-foreground">
          You can continue browsing without an account.
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
