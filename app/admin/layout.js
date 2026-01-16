import { Manrope } from "next/font/google";
import "../globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "DIIT Admin Dashboard",
  description: "Admin dashboard for managing DIIT website content",
};

export default function AdminLayout({ children }) {
  return children;
}
