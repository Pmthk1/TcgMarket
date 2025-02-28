"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ✅ กำหนดโครงสร้างของข้อมูลประมูล
type Auction = {
  id: string;
  card?: { imageUrl?: string; name?: string };
  imageUrl?: string; // ✅ เพิ่ม imageUrl ที่อาจอยู่ที่ auction โดยตรง
  cardName?: string; // ✅ เพิ่ม cardName ที่อาจอยู่ที่ auction โดยตรง
  startPrice: number;
  currentPrice: number;
  endTime: string;
};

// ✅ ปรับปรุงฟังก์ชัน getImageUrl ให้ตรวจสอบทั้ง card.imageUrl และ auction.imageUrl และแก้ไขปัญหา path ซ้ำซ้อน
const getImageUrl = (auction: Auction) => {
  // ตรวจสอบ imageUrl ทั้งใน card และในตัว auction
  const imageUrl = auction?.card?.imageUrl || auction?.imageUrl;
  
  if (!imageUrl) return "/no-image.png"; // ใช้ภาพเริ่มต้นถ้าไม่มี
  if (imageUrl.startsWith("http")) return imageUrl; // ใช้ URL ตรงถ้ามี
  if (imageUrl.startsWith("/uploads/")) return imageUrl; // ถ้ามี /uploads/ อยู่แล้ว ไม่ต้องเพิ่มอีก
  return `/uploads/${imageUrl}`; // ใช้รูปที่อัปโหลดไว้
};

// ✅ ฟังก์ชันช่วยหาชื่อสินค้า
const getCardName = (auction: Auction) => {
  return auction?.card?.name || auction?.cardName || "ไม่มีชื่อสินค้า";
};

export default function LiveAuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setError(null);
        const res = await fetch("/api/auctions/live");

        if (!res.ok) {
          throw new Error(`HTTP Error! Status: ${res.status}`);
        }

        const data: Auction[] = await res.json();
        console.log("🔥 Live Auctions Data:", data);

        setAuctions(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error("🚨 Error fetching live auctions:", error.message);
          setError(error.message);
        } else {
          console.error("🚨 Unknown error occurred");
          setError("เกิดข้อผิดพลาดที่ไม่รู้จัก");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) return <p className="text-center text-gray-500">กำลังโหลด...</p>;
  if (error)
    return (
      <div className="text-center text-red-500">🚨 เกิดข้อผิดพลาด: {error}</div>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🛎️ การประมูลที่กำลังดำเนินอยู่</h1>
      {auctions.length === 0 ? (
        <p className="text-center text-gray-500">ไม่มีการประมูลในขณะนี้</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-center">

          {auctions.map((auction) => {
            // ✅ ใช้ฟังก์ชันที่ปรับปรุงแล้ว
            const imageUrl = getImageUrl(auction);
            const cardName = getCardName(auction);
            const isLocalImage = !imageUrl.startsWith("http");

            return (
              <div
                key={auction.id}
                className="border p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition w-[300px] flex flex-col items-center"
              >
                <Image
                  src={imageUrl}
                  alt={cardName}
                  width={250}
                  height={250}
                  className="rounded-lg object-cover"
                  unoptimized={isLocalImage}
                />

                <h2 className="text-lg font-semibold mt-2">
                  {cardName}
                </h2>
                <p>💰 ราคาเริ่มต้น: {auction.startPrice.toLocaleString()} บาท</p>
                <p>🔥 ราคาปัจจุบัน: {auction.currentPrice.toLocaleString()} บาท</p>
                <p className="text-sm text-gray-500">
                  🕒 สิ้นสุด: {" "}
                  {new Date(auction.endTime).toLocaleString("th-TH", {
                    timeZone: "Asia/Bangkok",
                  })}
                </p>

                <button
                  className="bg-orange-400 text-white p-2 rounded mt-3 w-full hover:bg-orange-500 transition"
                  onClick={() => router.push(`/auctions/${auction.id}`)}
                >
                  ⚡ เข้าร่วมประมูล
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}