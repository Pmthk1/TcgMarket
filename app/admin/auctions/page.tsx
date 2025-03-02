"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import AdminHeader from "@/app/admin/components/AdminHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

interface Auction {
  id: string;
  status: string;
  endTime?: string;
  endedAt?: string;
}

export default function AdminAuctions() {
  const router = useRouter();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ฟังก์ชันตรวจสอบสถานะประมูลว่าควรเป็น CLOSED หรือไม่
  const checkAuctionStatus = (auction: Auction) => {
    // ถ้ามีการปิดประมูลแล้วหรือเวลาหมดแล้ว ให้เป็น CLOSED
    if (
      auction.status === "CLOSED" || 
      auction.endedAt || 
      (auction.endTime && new Date(auction.endTime) < new Date())
    ) {
      return { ...auction, status: "CLOSED" };
    }
    return auction;
  };

  // ใช้ useCallback เพื่อหลีกเลี่ยงการรีเฟรชฟังก์ชันทุกครั้งที่ useEffect ทำงาน
  const fetchAuctions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auctions");
      if (!res.ok) throw new Error("Failed to fetch auctions");

      const data: Auction[] = await res.json(); // ใช้ const แทน let

      // ตรวจสอบและอัปเดตสถานะตามเวลา
      const updatedAuctions = data.map(checkAuctionStatus);

      // อัปเดตสถานะประมูลที่ควรปิดแล้วในฐานข้อมูล
      for (const auction of updatedAuctions) {
        if (auction.status === "CLOSED" && data.find(a => a.id === auction.id)?.status !== "CLOSED") {
          await updateAuctionStatus(auction.id, "CLOSED");
        }
      }

      setAuctions(updatedAuctions);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    } finally {
      setLoading(false);
    }
  }, []); // ทำให้ `fetchAuctions` ไม่ถูกสร้างใหม่ทุกครั้ง

  // ฟังก์ชันอัปเดตสถานะประมูลในฐานข้อมูล
  const updateAuctionStatus = async (auctionId: string, status: string) => {
    try {
      await fetch(`/api/auctions/${auctionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error(`Error updating auction ${auctionId} status:`, error);
    }
  };

  useEffect(() => {
    if (isClient) {
      fetchAuctions();

      // ตั้งเวลาตรวจสอบและอัปเดตสถานะทุก 1 นาที
      const intervalId = setInterval(fetchAuctions, 60000);
      return () => clearInterval(intervalId);
    }
  }, [isClient, fetchAuctions]); // เพิ่ม `fetchAuctions` ลงใน dependency array

  // กรองรายการประมูลตามตัวกรอง
  const filteredAuctions = auctions.filter(
    (auction) => statusFilter === "ALL" || auction.status === statusFilter
  );

  // ฟังก์ชันรีเฟรชข้อมูล
  const refreshData = () => {
    fetchAuctions();
  };

  if (!isClient) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="p-6">
      <AdminHeader title="Manage Auctions" />
      <Card className="p-4 shadow-md">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-lg px-4 py-2 bg-white shadow-sm"
              >
                <option value="ALL">All</option>
                <option value="PENDING">Pending</option>
                <option value="ACTIVE">Active</option>
                <option value="CLOSED">Closed</option>
              </select>
              
              <Button
                onClick={refreshData}
                variant="outline"
                className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition"
              >
                Refresh
              </Button>
            </div>

            <Button
              onClick={() => router.push("/admin/auctions/create")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Create Auction
            </Button>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading auctions...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAuctions.map((auction) => (
                  <TableRow key={auction.id}>
                    <TableCell>{auction.id}</TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-lg text-white font-semibold ${
                          auction.status === "CLOSED"
                            ? "bg-red-500"
                            : auction.status === "ACTIVE"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {auction.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          router.push(`/admin/auctions/manage?id=${auction.id}`);
                        }}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800 transition"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
