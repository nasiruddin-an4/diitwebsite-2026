"use client";


import Header from "./components/Header";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import { DataStoreProvider } from "@/hooks/useDataStore";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname?.startsWith("/admin/");

  return (
      <DataStoreProvider>
        {!isAdminRoute && <Header />}
        <main className={isAdminRoute ? "" : "min-h-screen pt-16"}>
          {children}
        </main>
        {!isAdminRoute && <BackToTop />}
        {!isAdminRoute && <Footer />}
      </DataStoreProvider>
  );
}
