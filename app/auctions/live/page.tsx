"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ✅ กำหนดโครงสร้างของข้อมูลประมูล
type Auction = {
  id: string;
  card?: { imageUrl?: string; name?: string };
  imageUrl?: string;
  cardName?: string;
  startPrice: number;
  currentPrice: number;
  endTime: string;
  isClosed?: boolean;
  status?: string;
};

// ✅ ฟังก์ชันตรวจสอบและคืนค่า URL รูปภาพ
const getImageUrl = (auction: Auction) => {
  const imageUrl = auction?.card?.imageUrl || auction?.imageUrl;
  if (!imageUrl) return "/no-image.png";
  if (imageUrl.startsWith("http")) return imageUrl;
  return imageUrl.startsWith("/uploads/") ? imageUrl : `/uploads/${imageUrl}`;
};

// ✅ ฟังก์ชันช่วยหาชื่อสินค้า
const getCardName = (auction: Auction) => {
  return auction?.card?.name || auction?.cardName || "ไม่มีชื่อสินค้า";
};

// ✅ ฟังก์ชันตรวจสอบสถานะการประมูล
const isAuctionClosed = (auction: Auction) => {
  // ตรวจสอบจากฟิลด์ isClosed หรือ status
  if (auction.isClosed || auction.status === "CLOSED") {
    return true;
  }
  
  // ตรวจสอบจากเวลาปัจจุบันเทียบกับเวลาสิ้นสุด
  const now = new Date();
  const endTime = new Date(auction.endTime);
  return endTime < now;
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
        console.log("🔥 All Auctions Data:", data);

        // ประมวลผลข้อมูลเพื่อตรวจสอบสถานะอีกครั้ง
        const processedAuctions = data.map(auction => ({
          ...auction,
          isClosed: isAuctionClosed(auction)
        }));

        setAuctions(processedAuctions);
      } catch (error) {
        if (error instanceof Error) {
          console.error("🚨 Error fetching auctions:", error.message);
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

  // แยกประมูลตามสถานะ
  const activeAuctions = auctions.filter(auction => !isAuctionClosed(auction));
  const closedAuctions = auctions.filter(auction => isAuctionClosed(auction));
  
  if (loading) return <p className="text-center text-gray-500">กำลังโหลด...</p>;
  if (error)
    return <div className="text-center text-red-500">🚨 เกิดข้อผิดพลาด: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🛎️ รายการประมูลทั้งหมด</h1>
      {auctions.length === 0 ? (
        <p className="text-center text-gray-500">ไม่มีรายการประมูล</p>
      ) : (
        <>
          {activeAuctions.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-3">📢 การประมูลที่กำลังดำเนินอยู่</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {activeAuctions.map((auction) => renderAuctionCard(auction))}
              </div>
            </>
          )}
          
          {closedAuctions.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-3">🔒 การประมูลที่สิ้นสุดแล้ว</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {closedAuctions.map((auction) => renderAuctionCard(auction))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );

  // ฟังก์ชันสำหรับสร้างการ์ดประมูล
  function renderAuctionCard(auction: Auction) {
    const imageUrl = getImageUrl(auction);
    const cardName = getCardName(auction);
    const isLocalImage = !imageUrl.startsWith("http");
    const closed = isAuctionClosed(auction);

    return (
      <div
        key={auction.id}
        className={`border p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition w-full flex flex-col items-center ${closed ? 'opacity-90' : ''}`}
      >
        <div className="relative w-full">
          <Image
            src={imageUrl}
            alt={cardName}
            width={250}
            height={250}
            className="rounded-lg object-cover mx-auto"
            unoptimized={isLocalImage}
          />
          {closed && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
              ปิดการประมูลแล้ว
            </div>
          )}
        </div>

        <h2 className="text-lg font-semibold mt-2 text-center">{cardName}</h2>
        <p>💰 ราคาเริ่มต้น: {auction.startPrice.toLocaleString()} บาท</p>
        <p>🔥 ราคาปัจจุบัน: {auction.currentPrice.toLocaleString()} บาท</p>
        <p className="text-sm text-gray-500">
          🕒 สิ้นสุด:{" "}
          {new Date(auction.endTime).toLocaleString("th-TH", {
            timeZone: "Asia/Bangkok",
          })}
        </p>

        {closed ? (
          <p className="text-red-500 font-bold mt-2">🔒 ปิดการประมูลแล้ว</p>
        ) : (
          <button
            className="bg-orange-400 text-white p-2 rounded mt-3 w-full hover:bg-orange-500 transition"
            onClick={() => router.push(`/auctions/${auction.id}`)}
          >
            เข้าร่วมประมูล
          </button>
        )}
      </div>
    );
  }
}