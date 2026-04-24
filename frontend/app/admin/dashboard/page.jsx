"use client";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetcher } from "@/constants";
import api from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { toWords } from "to-words";
import Loader from "@/components/Loader";
import TopProducts from "@/components/admin/dashboard/TopProducts";
import PromoUsage from "@/components/admin/dashboard/PromoUsage";

export default function Page() {
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [customerCount, setCustomerCount] = useState(null);
  const [promoUsage, setPromoUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data, isLoading } = useSWR("/product/report/sold", fetcher);

  const getTotalRevenue = async () => {
    const { data } = await api.get("/order/report/totalRevenue");
    setTotalRevenue(data.totalRevenue);
  };

  const getCustomerCount = async () => {
    const { data } = await api.get("/users/customerCount");
    setCustomerCount(data.count);
  };

  const getPromoUsage = async () => {
    const { data } = await api.get("/promo/usage");
    setPromoUsage(data);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          getTotalRevenue(),
          getCustomerCount(),
          getPromoUsage(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); 

  if (loading) return <Loader />;

  return (
    <div className=" space-y-6">
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
            <div className="text-2xl font-bold">Rs. {totalRevenue}</div>
            <div className="text-sm text-muted-foreground">
              {totalRevenue != null
                ? toWords(Number(totalRevenue), { currency: true })
                : "--"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild variant="">
              <Link href="/admin/dashboard/product">Products</Link>
            </Button>
            <Button asChild variant="">
              <Link href="/admin/dashboard/category">Categories</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <TopProducts data={data} isLoading={isLoading} />
      <PromoUsage data={promoUsage} isLoading={isLoading} />
    </div>
  );
}
