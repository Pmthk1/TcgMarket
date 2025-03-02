"use client"; // ใช้ใน Client Component ได้

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  return isAdminPage ? null : <Navbar />;
}
