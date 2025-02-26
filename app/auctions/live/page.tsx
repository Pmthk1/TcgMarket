"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Auction = {
  id: string;
  card?: { imageUrl: string; name: string }; // แก้เป็น optional
  startPrice: number;
  currentPrice: number;
  endTime: string;
};

export default function LiveAuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await fetch("/api/auctions/live");
        if (!res.ok) throw new Error("Failed to fetch live auctions");

        const data: Auction[] = await res.json();
        setAuctions(data);
      } catch (error) {
        console.error("Error fetching live auctions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">การประมูลที่กำลังดำเนินอยู่</h1>
      {auctions.length === 0 ? (
        <p className="text-center text-gray-500">ไม่มีการประมูลในขณะนี้</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {auctions.map((auction) => (
            <div key={auction.id} className="border p-4 rounded-lg shadow-md">
              {/* ✅ เช็คว่ามี auction.card ก่อนแสดงรูป */}
              {auction.card ? (
                <Image
                  src={auction.card.imageUrl}
                  alt={auction.card.name}
                  width={200}
                  height={250}
                  className="rounded-lg"
                />
              ) : (
                <p className="text-red-500">ไม่มีภาพสินค้า</p>
              )}
              <h2 className="text-lg font-semibold mt-2">{auction.card?.name ?? "ไม่มีชื่อสินค้า"}</h2>
              <p>ราคาเริ่มต้น: {auction.startPrice} บาท</p>
              <p>ราคาปัจจุบัน: {auction.currentPrice} บาท</p>
              <p className="text-sm text-gray-500">สิ้นสุด: {new Date(auction.endTime).toLocaleString()}</p>
              <button
                className="bg-orange-400 text-white p-2 rounded mt-2 w-full"
                onClick={() => router.push(`/auctions/${auction.id}`)}
              >
                เข้าร่วมประมูล
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
