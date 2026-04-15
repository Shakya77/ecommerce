"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Heart,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  User,
  UserRound,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const topLinks = [
  { label: "Home", href: "/" },
  { label: "Category", href: "/category" },
  { label: "Products", href: "/products" },
  { label: "Sale", href: "/#deals" },
];

function isActive(pathname, href) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function BrandMark() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span className="font-heading text-base font-semibold tracking-[0.2em] uppercase text-foreground">
        Ecommerce
      </span>
    </Link>
  );
}

function NavLink({ href, label, pathname, className }) {
  const active = isActive(pathname, href);

  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className={cn(
          navigationMenuTriggerStyle(),
          "bg-transparent text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
          active && "bg-muted text-foreground",
          className,
        )}
      >
        {label}
      </Link>
    </NavigationMenuLink>
  );
}

function MobileLink({ href, label, pathname, onClick }) {
  const active = isActive(pathname, href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-sm border border-border/70 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted",
        active && "bg-muted text-foreground",
      )}
    >
      <span>{label}</span>
      <ArrowRight className="size-4 text-muted-foreground" />
    </Link>
  );
}

export function NavigationBar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl supports-backdrop-filter:bg-background/70">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/15 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <BrandMark />

          <div className="hidden items-center gap-2 lg:flex">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                {topLinks.map((item) => (
                  <NavigationMenuItem key={item.label}>
                    <NavLink
                      href={item.href}
                      label={item.label}
                      pathname={pathname}
                    />
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Button
              asChild
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href="/">
                <Search className="size-4" />
                <span className="sr-only">Search</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href="/">
                <Heart className="size-4" />
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href="/">
                <ShoppingCart className="size-4" />
                <span className="sr-only">Shopping Cart</span>
              </Link>
            </Button>
            {user ? (
              <DropdownMenu>
                {/* Trigger */}
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <User className="size-4" />
                  </Button>
                </DropdownMenuTrigger>

                {/* Menu */}
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <User className="size-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-2 text-red-500 focus:text-red-500"
                  >
                    <LogOut className="size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="ghost"
                  className="rounded-full px-4 text-muted-foreground hover:text-foreground"
                >
                  <Link href="/login">
                    <UserRound className="size-4" />
                    Sign in
                  </Link>
                </Button>
                <Button
                  asChild
                  className="rounded-full px-4 shadow-lg shadow-slate-900/10"
                >
                  <Link href="/signup">
                    Get started
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Button
              asChild
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href="/login">
                <UserRound className="size-4" />
                <span className="sr-only">Sign in</span>
              </Link>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="rounded-full"
                >
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full border-border/70 bg-background sm:max-w-md"
              >
                <SheetHeader className="space-y-4 border-b border-border/60 pb-4">
                  <SheetTitle>
                    <BrandMark />
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-1 flex-col gap-3 p-2">
                  {topLinks.map((item) => (
                    <MobileLink
                      key={item.label}
                      href={item.href}
                      label={item.label}
                      pathname={pathname}
                    />
                  ))}
                </div>

                <div className="mt-auto grid gap-3 rounded-[1.5rem] bg-muted/60 p-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                  {/* Wishlist */}
                  <Button
                    asChild
                    variant="ghost"
                    className="flex items-center justify-center gap-2 rounded-2xl text-muted-foreground hover:text-foreground"
                  >
                    <Link href="/">
                      <Heart className="size-4" />
                      <span className="text-sm">Wishlist</span>
                    </Link>
                  </Button>

                  {/* Cart */}
                  <Button
                    asChild
                    variant="ghost"
                    className="flex items-center justify-center gap-2 rounded-2xl text-muted-foreground hover:text-foreground"
                  >
                    <Link href="/">
                      <ShoppingCart className="size-4" />
                      <span className="text-sm">Cart</span>
                    </Link>
                  </Button>

                  {/* Logout */}
                  {user && (
                    <Button
                      onClick={logout}
                      variant="outline"
                      className="flex items-center justify-center gap-2 rounded-sm col-span-2 sm:col-span-1"
                    >
                      <LogOut className="size-4" />
                      <span className="text-sm">Logout</span>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
