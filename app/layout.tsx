import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";
import NavbarWrapper from "@/components/Navbar/NavbarWrapper"; // นำ Navbar ไปใช้จาก Component ใหม่

export const metadata: Metadata = {
  title: "TCGMarket",
  description: "TCG Card Trading Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/tcg.ico" type="image/x-icon" />
      </head>
      <body className="antialiased">
        <Providers>
          <NavbarWrapper /> {/* ใช้ Component ที่แยกใหม่ */}
          <main className="p-2 mt-2">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
