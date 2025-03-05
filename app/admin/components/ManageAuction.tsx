"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSWR from "swr";

interface Card {
  id: string;
  name: string;
  type: string;
  startingPrice: number;
  imageUrl?: string;
}

interface Auction {
  id: string;
  cardName?: string;
  cardType?: string;
  title: string;
  description: string;
  imageUrl: string;
  status: string;
  startingPrice?: number;
  currentPrice: number;
  endTime: string;
  createdAt: string;
  endedAt: string | null;
  isClosed: boolean;
  card?: Card;
}

type AuctionStatus = "PENDING" | "ACTIVE" | "CLOSED";

// SWR fetcher function
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    throw error;
  }
  return res.json();
};

export default function ManageAuction() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  
  const [endTime, setEndTime] = useState<string>("");
  const [loading, setLoading] = useState({ delete: false, close: false, update: false });
  
  const { data: auction, error, mutate } = useSWR<Auction>(
    id ? `/api/auctions/${id}` : null, 
    fetcher, 
    { 
      refreshInterval: 5000,
      revalidateOnFocus: true
    }
  );

  useEffect(() => {
    if (auction?.endTime) {
      setEndTime(new Date(auction.endTime).toISOString().slice(0, 16));
    }
  }, [auction]);

  async function handleDelete() {
    if (!id || !confirm("คุณต้องการลบการประมูลนี้หรือไม่?")) return;
    setLoading((prev) => ({ ...prev, delete: true }));
    try {
      const res = await fetch(`/api/auctions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("ไม่สามารถลบการประมูลได้");

      alert("ลบการประมูลเรียบร้อยแล้ว");
      router.push("/admin/auctions");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบการประมูล:", error);
      alert(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการลบการประมูล");
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  }

  async function handleCloseAuction() {
    if (!id || !confirm("คุณต้องการปิดการประมูลนี้หรือไม่?")) return;
    setLoading((prev) => ({ ...prev, close: true }));
    try {
      const res = await fetch(`/api/auctions/${id}`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "close" })
      });
      
      if (!res.ok) throw new Error("ไม่สามารถปิดการประมูลได้");

      alert("ปิดการประมูลเรียบร้อยแล้ว");
      await mutate();
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการปิดการประมูล:", error);
      alert(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการปิดการประมูล");
    } finally {
      setLoading((prev) => ({ ...prev, close: false }));
    }
  }

  async function handleUpdateEndTime() {
    if (!id || !endTime) return;
    setLoading((prev) => ({ ...prev, update: true }));
    try {
      const res = await fetch(`/api/auctions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endTime }),
      });
      if (!res.ok) throw new Error("ไม่สามารถอัปเดตเวลาสิ้นสุดการประมูลได้");

      alert("อัปเดตเวลาสิ้นสุดการประมูลเรียบร้อยแล้ว");
      await mutate();
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัปเดตเวลาสิ้นสุดการประมูล:", error);
      alert(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการอัปเดตเวลา");
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  }

  if (!id) return <p>ไม่ได้เลือกการประมูล</p>;
  if (!auction) return <p>กำลังโหลด...</p>;
  if (error) return <p className="text-red-500">ข้อผิดพลาด: {error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ"}</p>;

  const isAuctionClosed =
    auction.status === "CLOSED" ||
    auction.endedAt !== null ||
    auction.isClosed === true ||
    (auction.endTime ? new Date(auction.endTime) < new Date() : false);

  const statusThai: Record<AuctionStatus, string> = {
    PENDING: "รอดำเนินการ",
    ACTIVE: "กำลังประมูล",
    CLOSED: "ปิดการประมูลแล้ว"
  };

  const getThaiStatus = (status: string): string => {
    return (statusThai as Record<string, string>)[status] || status;
  };

  const displayStatus = isAuctionClosed ? "CLOSED" : auction.status;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>จัดการการประมูล</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-black-700">
                {auction.card?.name || auction.cardName || "ไม่มีชื่อการ์ด"}
              </h2>
              <p className="text-gray-600">{auction.description}</p>
              <p className="mt-1 font-bold text-green-600">
                ราคาประมูลปัจจุบัน: ฿{auction.currentPrice.toLocaleString()}
              </p>
              <p className="mt-2 text-sm">
                สถานะ:{" "}
                <span
                  className={`px-2 py-1 rounded-md text-white ${
                    isAuctionClosed
                      ? "bg-red-500"
                      : displayStatus === "PENDING"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                >
                  {isAuctionClosed ? "ปิดการประมูลแล้ว" : getThaiStatus(displayStatus)}
                </span>
              </p>
              <p className="mt-2 text-xs text-gray-500">
                สร้างเมื่อ: {new Date(auction.createdAt).toLocaleString("th-TH")}
              </p>
              {auction.endedAt && (
                <p className="mt-2 text-xs text-gray-500">
                  ปิดประมูลเมื่อ: {new Date(auction.endedAt).toLocaleString("th-TH")}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                เวลาสิ้นสุดการประมูล: {new Date(auction.endTime).toLocaleString("th-TH")}
              </p>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  วันที่และเวลาสิ้นสุด:
                </label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  disabled={isAuctionClosed}
                />
                <Button
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={handleUpdateEndTime}
                  disabled={loading.update || isAuctionClosed}
                >
                  {loading.update ? "กำลังอัปเดต..." : "อัปเดตเวลาสิ้นสุด"}
                </Button>
              </div>
            </div>
            <div>
              {auction.imageUrl ? (
                <Image
                  src={auction.imageUrl}
                  alt={auction.title || "รูปภาพการประมูล"}
                  width={500}
                  height={300}
                  className="w-full rounded-lg shadow-md object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-lg">
                  <p className="text-gray-500">ไม่มีรูปภาพ</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/auctions")}
              className="text-gray-700 border-gray-400"
            >
              ย้อนกลับ
            </Button>
            {!isAuctionClosed && (
              <Button
                variant="secondary"
                onClick={handleCloseAuction}
                disabled={loading.close}
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                {loading.close ? "กำลังปิด..." : "ปิดการประมูล"}
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading.delete}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading.delete ? "กำลังลบ..." : "ลบการประมูล"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
