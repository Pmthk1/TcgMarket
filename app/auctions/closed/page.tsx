"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuctionClosed() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auctions/live"); // กลับไปหน้าหลักหลังจาก 5 วินาที
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]); // ✅ เพิ่ม router เข้าไปใน dependency array

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
      <h1 className="text-4xl text-red-600 font-bold">ปิดการประมูล</h1>
      <button
        onClick={() => router.push("/auctions/live")}
        className="mt-4 px-4 py-2 bg-blue-400 text-white rounded-lg"
      >
        กลับสู่หน้าหลัก
      </button>
    </div>
  );
}
