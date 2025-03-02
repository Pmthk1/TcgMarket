"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, Coins, TrendingUp } from "lucide-react";

// Create a Badge component since it's missing
const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

type Auction = {
  id: string;
  card?: { imageUrl?: string; name?: string };
  startPrice?: number;
  currentPrice?: number;
  endTime?: string;
  isClosed?: boolean;
  status?: string;
};

export default function AuctionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBidOpen, setIsBidOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [imageError, setImageError] = useState(false);
  const [fallbackImage, setFallbackImage] = useState<string | null>(null);

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

        const data: Auction = await res.json();
        console.log("ข้อมูลประมูลที่ได้รับ:", data);
        
        if (!data.card?.imageUrl && data.card?.name) {
          try {
            const imageRes = await fetch(`/api/find-images?cardName=${encodeURIComponent(data.card.name)}`);
            if (imageRes.ok) {
              const imageData = await imageRes.json();
              setFallbackImage(imageData.imageUrl || `/uploads/${data.card.name.toLowerCase().replace(/\s+/g, '-')}.png?t=${Date.now()}`);
            }
          } catch (imgErr) {
            console.error("ไม่สามารถค้นหารูปภาพจากชื่อการ์ดได้:", imgErr);
          }
        }

        setAuction(data);
        setError("");

        if (data.endTime) {
          const auctionEndTime = new Date(data.endTime).getTime();
          setTimeLeft(auctionEndTime - Date.now());

          const interval = setInterval(() => {
            const remainingTime = auctionEndTime - Date.now();
            setTimeLeft(remainingTime);
            if (remainingTime <= 0) {
              clearInterval(interval);
              router.push("/auctions/closed");
            }
          }, 1000);

          return () => clearInterval(interval);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "ไม่สามารถโหลดข้อมูลการประมูลได้");
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id, router]);

  const placeBid = async () => {
    if (!auction || auction.isClosed || auction.status === "CLOSED") {
      alert("🚫 การประมูลนี้ปิดแล้ว ไม่สามารถเสนอราคาได้");
      return;
    }

    const bidValue = Number(bidAmount);
    const minBid = (auction.currentPrice ?? auction.startPrice) ?? 0;

    if (isNaN(bidValue) || bidValue <= minBid) {
      alert(`กรุณาเสนอราคามากกว่าราคาปัจจุบัน (${minBid.toLocaleString()} บาท)`);
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

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className="mx-auto max-w-lg p-6 bg-red-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">ข้อผิดพลาด</p>
          <p className="text-red-500">{error}</p>
          <Button 
            onClick={() => router.push("/auctions/live")} 
            className="mt-4 bg-blue-500 hover:bg-blue-600">
            กลับไปหน้าหลักประมูล
          </Button>
        </div>
      </Card>
    );
  }
  
  if (!auction) {
    return (
      <Card className="mx-auto max-w-lg p-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-600">ไม่พบข้อมูลการประมูล</p>
          <Button 
            onClick={() => router.push("/auctions/live")} 
            className="mt-4 bg-blue-500 hover:bg-blue-600">
            กลับไปหน้าหลักประมูล
          </Button>
        </div>
      </Card>
    );
  }

  const imageUrl = !imageError && auction.card?.imageUrl ? auction.card.imageUrl : fallbackImage;
  const isAuctionClosed = auction.isClosed || auction.status === "CLOSED" || (timeLeft !== null && timeLeft <= 0);

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Button 
        onClick={() => router.push("/auctions/live")} 
        className="mb-4 flex items-center gap-2 bg-blue-500 hover:bg-blue-600">
        <ArrowLeft size={16} />
        กลับไปหน้าหลักประมูล
      </Button>
      
      <Card className="overflow-hidden border-2 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Card Image Section */}
          <div className="md:w-1/2 p-4 flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200">
            {imageUrl ? (
              <div className="relative w-full max-w-md h-96 transition-transform hover:scale-105">
                <Image
                  src={imageUrl}
                  alt={auction.card?.name || "สินค้าประมูล"}
                  fill
                  className="rounded-lg object-contain drop-shadow-md"
                  unoptimized
                  onError={handleImageError}
                />
                {isAuctionClosed && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <Badge className="text-lg px-4 py-2 bg-red-600 text-white">ปิดการประมูลแล้ว</Badge>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-64 bg-gray-200 rounded-lg">
                <p className="text-gray-500">ไม่มีรูปภาพ</p>
              </div>
            )}
          </div>
          
          {/* Auction Details Section */}
          <div className="md:w-1/2 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{auction.card?.name || "ไม่ทราบชื่อสินค้า"}</h1>
              <Badge className="text-sm px-3 py-1 mr-2">{auction.id}</Badge>
            </div>
            
            {/* Timer Section */}
            <div className="mb-6">
              {timeLeft !== null && timeLeft > 0 ? (
                <div className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center text-blue-600 mb-2">
                    <Clock className="mr-2" size={20} />
                    <span className="font-semibold">เวลาที่เหลือ:</span>
                  </div>
                  <CountdownTimer endTime={auction.endTime!} />
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-red-50">
                  <p className="text-red-600 font-bold flex items-center">
                    <Clock className="mr-2" size={20} />
                    หมดเวลาการประมูล
                  </p>
                </div>
              )}
            </div>
            
            {/* Price Section */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <Coins className="mr-2 text-gray-500" size={20} />
                <span className="text-gray-500">ราคาเริ่มต้น:</span>
                <span className="ml-2 font-medium text-lg text-gray-700">{auction.startPrice?.toLocaleString()} บาท</span>
              </div>
              
              <div className="flex items-center">
                <TrendingUp className="mr-2 text-green-500" size={20} />
                <span className="text-gray-600">ราคาปัจจุบัน:</span>
                <span className="ml-2 font-bold text-xl text-green-600">{auction.currentPrice?.toLocaleString()} บาท</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-8">
              {isAuctionClosed ? (
                <Badge className="text-md px-4 py-2 bg-red-600 text-white">🚫 การประมูลนี้ปิดแล้ว</Badge>
              ) : (
                <Button 
                  onClick={() => setIsBidOpen(true)} 
                  className="w-full py-6 text-lg bg-orange-500 hover:bg-orange-600 transition-all transform hover:scale-105">
                  เสนอราคา
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Bid Dialog */}
      <Dialog open={isBidOpen} onOpenChange={setIsBidOpen}>
        <DialogContent>
          <DialogTitle>เสนอราคาประมูล</DialogTitle>
          
          <div className="p-4">
            <p className="mb-2 text-center">ราคาปัจจุบัน: <span className="font-bold text-green-600">{auction.currentPrice?.toLocaleString()} บาท</span></p>
            <Input
              type="number"
              placeholder={`กรอกราคาที่ต้องการเสนอ (มากกว่า ${auction.currentPrice} บาท)`}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="mb-2 py-6 text-lg"
            />
          </div>
          
          <DialogFooter>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button 
                onClick={() => setIsBidOpen(false)} 
                variant="outline" 
                className="w-full sm:w-1/2">
                ยกเลิก
              </Button>
              <Button 
                onClick={placeBid} 
                className="w-full sm:w-1/2 bg-orange-500 hover:bg-orange-600">
                ยืนยันการเสนอราคา
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}