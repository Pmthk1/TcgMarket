import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/components/context/CartContext";

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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/images/tcg.ico" type="image/x-icon" />
        </head>
        <body className="antialiased">
          <CartProvider> {/* ครอบ CartProvider เพื่อใช้ตะกร้าสินค้าทุกหน้า */}
            <Navbar />
            <main className="p-2 mt-2">{children}</main>
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
