"use client";

import { useState } from "react";
import { NavigationBar } from "@/components/website/Navbar";
import WebsiteBreadcrumb from "@/components/website/WebsiteBreadcrumb";
import { SignupForm } from "@/components/signup-form";
import { useAuth } from "@/context/AuthContext";

export default function layout({ children }) {
  const { isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login");

  const handleOpenAuthModal = (tab = "login") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <>
      <NavigationBar onOpenAuthModal={handleOpenAuthModal} />
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8 py-8">
        <WebsiteBreadcrumb />
        <main className="mt-6">{children}</main>
      </div>

      {!isAuthenticated && (
        <SignupForm
          open={authModalOpen}
          onOpenChange={setAuthModalOpen}
          defaultTab={authModalTab}
        />
      )}
    </>
  );
}
