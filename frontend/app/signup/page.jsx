"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/signup-form";

export default function Page() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) {
      router.replace("/");
    }
  }, [open, router]);

  return <SignupForm open={open} onOpenChange={setOpen} defaultTab="signup" />;
}
