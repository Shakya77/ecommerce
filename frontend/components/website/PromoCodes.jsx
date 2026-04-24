"use client";

import { fetcher } from "@/constants";
import useSWR from "swr";
import Marquee from "react-fast-marquee";
import Loader from "../Loader";

export default function PromoCodes() {
  const { data, isLoading, error } = useSWR("/promo/codes", fetcher);

  if (isLoading) return <Loader />;

  if (data?.length === 0) {
    return null;
  }

  return (
    <Marquee speed={100} pauseOnHover gradient={false}>
      🎉 PROMO CODES TO GET DISCOUNTS:{" "}
      {data?.map((promo) => promo.code).join(" , ")}
    </Marquee>
  );
}
