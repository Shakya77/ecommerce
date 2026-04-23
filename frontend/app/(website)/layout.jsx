"use client";

import { useState } from "react";
import { NavigationBar } from "@/components/website/Navbar";
import WebsiteBreadcrumb from "@/components/website/WebsiteBreadcrumb";
import { SignupForm } from "@/components/signup-form";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import { CartProvider } from "@/context/CartContext";

export default function layout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login");

  const handleOpenAuthModal = (tab = "login") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  if (loading) return <Loader />;

  return (
    <>
      <CartProvider>
        <NavigationBar onOpenAuthModal={handleOpenAuthModal} />
        <div className="mx-auto max-w-360  sm:px-6 lg:px-8 pb-8">
          <WebsiteBreadcrumb />
          <main className="mt-6">{children}</main>
        </div>
      </CartProvider>

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
