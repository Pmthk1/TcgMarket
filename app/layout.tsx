import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Providers from "./Providers"; // ตรวจสอบให้ตรงกับชื่อไฟล์ที่ใช้

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
          <Navbar />
          <main className="p-2 mt-2">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
