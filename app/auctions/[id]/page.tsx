"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Auction = {
  id: string;
  card: { imageUrl: string; name: string };
  startPrice: number;
  currentPrice: number;
};

export default function AuctionDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBidOpen, setIsBidOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState("");

  useEffect(() => {
    if (!id) {
      setError("ไม่พบรหัสการประมูล");
      setLoading(false);
      return;
    }

    const fetchAuction = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/auctions/${id}?t=${Date.now()}`);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "ไม่สามารถดึงข้อมูลประมูลได้");
        }
        
        const data = await res.json();
        if (!data || !data.card) {
          throw new Error("ข้อมูลประมูลไม่ถูกต้อง");
        }
        
        setAuction(data);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "ไม่สามารถโหลดข้อมูลการประมูลได้");
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id]);

  const placeBid = async () => {
    if (!auction) return;

    const bidValue = Number(bidAmount);
    if (isNaN(bidValue) || bidValue <= (auction.currentPrice || auction.startPrice)) {
      alert("กรุณาเสนอราคาที่สูงกว่าราคาปัจจุบัน");
      return;
    }

    try {
      const res = await fetch(`/api/auctions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bidAmount: bidValue }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "ไม่สามารถเสนอราคาได้");
      }

      const updatedAuction = await res.json();
      setAuction(updatedAuction);
      setBidAmount("");
      setIsBidOpen(false);
      alert("เสนอราคาสำเร็จ!");
    } catch (error) {
      alert(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการเสนอราคา");
    }
  };

  if (loading) return <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>;
  if (error) return <p className="text-center text-red-500">ข้อผิดพลาด: {error}</p>;
  if (!auction) return <p className="text-center text-gray-500">ไม่พบข้อมูลการประมูล</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{auction.card.name}</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-auto">
          <Image
            src={auction.card.imageUrl}
            alt={auction.card.name}
            width={300}
            height={400}
            className="rounded-lg mx-auto md:mx-0"
          />
        </div>
        <div className="mt-4 md:mt-0">
          <p className="text-lg">ราคาเริ่มต้น: {auction.startPrice.toLocaleString()} บาท</p>
          <p className="text-lg font-bold">
            ราคาปัจจุบัน: {(auction.currentPrice || auction.startPrice).toLocaleString()} บาท
          </p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded mt-4 w-full md:w-auto" onClick={() => setIsBidOpen(true)}>
            เสนอราคา
          </Button>
        </div>
      </div>

      {/* Modal สำหรับเสนอราคา */}
      <Dialog open={isBidOpen} onOpenChange={setIsBidOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เสนอราคา</DialogTitle>
          </DialogHeader>
          <div className="my-4">
            <p className="mb-2">ราคาปัจจุบัน: {(auction.currentPrice || auction.startPrice).toLocaleString()} บาท</p>
            <Input
              type="number"
              placeholder="กรอกราคาที่ต้องการเสนอ"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="mb-2"
            />
            <p className="text-sm text-gray-500">* ราคาที่เสนอต้องมากกว่าราคาปัจจุบัน</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsBidOpen(false)} variant="outline" className="mr-2">
              ยกเลิก
            </Button>
            <Button onClick={placeBid} className="bg-orange-500 hover:bg-orange-600">
              ยืนยันการเสนอราคา
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
