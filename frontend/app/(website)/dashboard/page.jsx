"use client";

import Loader from "@/components/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Account from "@/components/user/dashboard/Account";
import Address from "@/components/user/dashboard/Address";
import Order from "@/components/user/dashboard/Order";
import { fetcher } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

export default function page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    data: profile,
    error,
    isLoading,
    mutate,
  } = useSWR("/users/profile", fetcher);

  const { user, isAuthenticated, loading } = useAuth();

  const defaultTab =
    searchParams.get("tab") === "orders" ? "orders" : "account";

  useEffect(() => {
    document.title = "Dashboard - My Account";

    if (loading) return;

    if (!isAuthenticated) {
      router.push("/");
    }
  }, [user]);

  if (isLoading) return <Loader />;

  return (
    <Tabs
      defaultValue={defaultTab}
      orientation="vertical"
      className="flex gap-6"
    >
      <TabsList className="flex flex-col w-56 p-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="address">Address Book</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card className="rounded-sm">
          <CardContent>
            <Account data={profile} mutate={mutate} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="orders">
        <Card className="rounded-sm">
          <CardContent>
            <Order />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="address">
        <Card className="rounded-sm">
          <CardContent>
            <Address />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
