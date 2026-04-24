import { LoaderIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Spinner({ className, ...props }) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export function LoadingSpinner({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 w-full justify-center py-6",
        className,
      )}
      {...props}
    >
      <Spinner />
      <p className="text-sm text-gray-500">Loading more products...</p>
    </div>
  );
}
