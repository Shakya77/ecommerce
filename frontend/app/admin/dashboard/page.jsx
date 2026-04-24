"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetcher } from "@/constants";
import Link from "next/link";
import useSWR from "swr";
import { toWords } from "to-words";
import Loader from "@/components/Loader";
import TopProducts from "@/components/admin/dashboard/TopProducts";
import PromoUsage from "@/components/admin/dashboard/PromoUsage";
import { formatCurrency } from "@/lib/currency";

export default function Page() {
  // Product report
  const { data: productData, isLoading: productLoading } = useSWR(
    "/product/report/sold",
    fetcher,
  );

  // Revenue
  const { data: revenueData, isLoading: revenueLoading } = useSWR(
    "/order/report/totalRevenue",
    fetcher,
  );

  // Customers
  const { data: customerData, isLoading: customerLoading } = useSWR(
    "/users/customerCount",
    fetcher,
  );

  // Promo usage
  const { data: promoUsage, isLoading: promoLoading } = useSWR(
    "/promo/usage",
    fetcher,
  );

  const totalRevenue = revenueData?.totalRevenue;
  const customerCount = customerData?.count;

  const loading =
    productLoading || revenueLoading || customerLoading || promoLoading;

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerCount ?? "--"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue) ?? "--"}
            </div>

            <div className="text-sm text-muted-foreground">
              {totalRevenue != null
                ? toWords(totalRevenue, { currency: true })
                : "--"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/admin/dashboard/product">Products</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/dashboard/category">Categories</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <TopProducts data={productData} isLoading={productLoading} />
        <PromoUsage data={promoUsage} isLoading={promoLoading} />
      </div>
    </div>
  );
}
