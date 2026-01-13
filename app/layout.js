import { Manrope } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "DIIT - Dhaka International Institute of Technology",
  description: "A premier institute committed to providing quality education in technology and management.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} antialiased font-sans`}
      >
        <Header />
        <main className="min-h-screen pt-16">{children}</main>
        <BackToTop />
        <Footer />
      </body>
    </html>
  );
}
