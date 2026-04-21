"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Account from "@/components/user/dashboard/Account";
import { fetcher } from "@/constants";
import { useEffect } from "react";
import useSWR from "swr";

export default function page() {
  const {
    data: profile,
    error,
    isLoading,
    mutate,
  } = useSWR("/users/profile", fetcher);

  useEffect(() => {
    document.title = "Dashboard - My Account";
  }, []);

  return (
    <Tabs defaultValue="account" orientation="vertical" className="flex gap-6">
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
          <CardContent>hello 2</CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
