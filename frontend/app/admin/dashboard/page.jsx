"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetcher } from "@/constants";
import api from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { toWords } from "to-words";

export default function Page() {
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [customerCount, setCustomerCount] = useState(null);

  const { data, isLoading } = useSWR("/product/report/sold", fetcher);

  const getTotalRevenue = async () => {
    const { data } = await api.get("/order/report/totalRevenue");
    setTotalRevenue(data.totalRevenue);
  };

  const getCustomerCount = async () => {
    const { data } = await api.get("/users/customerCount");
    setCustomerCount(data.count);
  };

  const getTotalRevenueText = () => {
    if (!totalRevenue) return "";
    return toWords(totalRevenue);
  };

  useEffect(() => {
    getTotalRevenue();
    getCustomerCount();
  }, []);

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
            <div className="text-2xl font-bold">Rs. {totalRevenue ?? 0}</div>
            <div className="text-sm text-muted-foreground">
              {getTotalRevenueText()}
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
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sn</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Total Sold</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name.slice(0, 60)}</TableCell>
                    <TableCell className="text-right">
                      {item.totalSold}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
