"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type BidHistory = {
  id: string;
  auctionId: string;
  title: string;
  image: string;
  bidAmount: number;
  status: string;
  createdAt: string;
};

export default function WonAuctionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState<BidHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ถ้าไม่ได้เข้าสู่ระบบ ให้ Redirect ไปหน้า Login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // ดึงข้อมูลประวัติการประมูลเมื่อ session พร้อม
  useEffect(() => {
    if (status === "loading" || !session?.user?.id) return;

    async function fetchBidHistory() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/auctions/won");

        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        setHistory(data);
      } catch (err) {
        console.error("❌ Error:", err);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    }

    fetchBidHistory();
  }, [session, status]);

  // แสดงสถานะ Loading
  if (status === "loading" || loading) {
    return <div className="p-6 text-center">กำลังโหลดข้อมูล...</div>;
  }

  // แสดงข้อผิดพลาด
  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">ประวัติการประมูลที่ชนะ</h1>

      {history.length === 0 ? (
        <p className="text-gray-500">ยังไม่มีประวัติการประมูล</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((bid) => (
            <div key={bid.id} className="border rounded-lg p-4 shadow-lg">
              <Image
                src={bid.image}
                alt={bid.title}
                width={300}
                height={200}
                className="rounded-lg"
                unoptimized
              />
              <h2 className="text-lg font-semibold mt-2">{bid.title}</h2>
              <p className="text-gray-700">
                ราคาประมูล: {bid.bidAmount.toLocaleString()} บาท
              </p>
              <p
                className={`mt-1 font-bold ${
                  bid.status === "ชนะ" ? "text-green-500" : "text-red-500"
                }`}
              >
                {bid.status}
              </p>
              <Link
                href={`/auctions/${bid.auctionId}`}
                className="mt-2 block text-blue-500 hover:underline"
              >
                ดูรายละเอียดการประมูล
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
