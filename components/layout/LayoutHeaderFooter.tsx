"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";

const AUTH_ROUTES = ["/signin", "/signup", "/forgot-password", "/verify-otp", "/reset-password"];

export function LayoutHeaderFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  return (
    <>
      {!isAuthRoute && <Navbar />}
      {children}
      {!isAuthRoute && <Footer />}
    </>
  );
}
