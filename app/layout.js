"use client";

import { Manrope } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import { usePathname } from "next/navigation";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased font-sans`}>
        {!isAdminRoute && <Header />}
        <main className={isAdminRoute ? "" : "min-h-screen pt-16"}>
          {children}
        </main>
        {!isAdminRoute && <BackToTop />}
        {!isAdminRoute && <Footer />}
      </body>
    </html>
  );
}
