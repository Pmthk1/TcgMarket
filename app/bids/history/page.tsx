"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type BidHistoryItem = {
  auctionId: string;
  cardName: string | null;
  imageUrl: string;
  startPrice: number;
  lastBidAmount: number;
  lastBidTime: string;
  currentPrice?: number;
  status?: string;
};

export default function BidHistoryPage() {
  const [items, setItems] = useState<BidHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/bids/history");
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Failed to load bid history (${res.status})`);
        }
        const data: BidHistoryItem[] = await res.json();
        setItems(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ✅ แสดงแค่ข้อความ Loading...
  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">ประวัติการประมูล</h1>
        <Card className="p-6 text-red-600">{error}</Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">ประวัติการประมูล</h1>
        <Link href="/auctions/live">
          <Button variant="outline">ไปหน้าประมูล</Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-600">ยังไม่มีประวัติการประมูล</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <Link key={`${item.auctionId}-${index}`} href={`/auctions/${item.auctionId}`} className="group">
              <Card className="p-4 hover:shadow-lg transition-shadow h-full">
                <div className="flex gap-4">
                  <div className="relative w-28 h-28 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.cardName || "card"}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        ไม่มีรูป
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 group-hover:text-blue-600">
                      {item.cardName || "ไม่ทราบชื่อการ์ด"}
                    </p>
                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                      <p>
                        ราคาเริ่มต้น: <span className="font-medium">{item.startPrice.toLocaleString()} บาท</span>
                      </p>
                      <p>
                        ราคาที่คุณประมูลล่าสุด:{" "}
                        <span className="font-semibold text-green-600">
                          {item.lastBidAmount.toLocaleString()} บาท
                        </span>
                      </p>
                      <p>
                        ราคาปัจจุบัน:{" "}
                        <span className="font-bold text-blue-600">{item.currentPrice?.toLocaleString()} บาท</span>
                      </p>
                      <p>เวลาล่าสุดที่คุณประมูล: {new Date(item.lastBidTime).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
