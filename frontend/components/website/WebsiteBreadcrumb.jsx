"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const LABEL_OVERRIDES = {
  cart: "Cart",
  checkout: "Checkout",
  login: "Login",
  products: "Products",
  profile: "Profile",
  signup: "Sign Up",
  wishlist: "Wishlist",
};

function toTitleCase(value) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function segmentToLabel(segment) {
  const decodedSegment = decodeURIComponent(segment);

  if (LABEL_OVERRIDES[decodedSegment]) {
    return LABEL_OVERRIDES[decodedSegment];
  }

  return toTitleCase(decodedSegment.replace(/[-_]+/g, " "));
}

export default function WebsiteBreadcrumb() {
  const pathname = usePathname();
  const cleanPath = pathname?.split("?")[0] ?? "/";

  if (cleanPath === "/") {
    return null;
  }

  const segments = cleanPath.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const label = segmentToLabel(segment);
          const isLast = index === segments.length - 1;

          return (
            <Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
