"use client";
import Form from "@/components/dashboard/carousel/Form";
import { useParams } from "next/navigation";

export default function page() {
  const { id } = useParams();

  return <Form mode="edit" carouselId={id} />;
}
