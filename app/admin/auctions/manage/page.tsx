"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface Auction {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: string;
  currentPrice: number;
  endTime: string;
}

export default function ManageAuction() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState({ fetch: true, delete: false, close: false, update: false });
  const [error, setError] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    async function fetchAuction() {
      try {
        const res = await fetch(`/api/auctions/${id}`);
        if (!res.ok) throw new Error("Failed to fetch auction");

        const data: Auction = await res.json();
        setAuction(data);
        setEndTime(new Date(data.endTime).toISOString().slice(0, 16)); // แปลงเป็น datetime-local
        setError(null);
      } catch (error) {
        console.error("Error fetching auction:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading((prev) => ({ ...prev, fetch: false }));
      }
    }
    fetchAuction();
  }, [id]);

  async function handleDelete() {
    if (!id || !confirm("คุณต้องการลบการประมูลนี้หรือไม่?")) return;
    setLoading((prev) => ({ ...prev, delete: true }));
    try {
      const res = await fetch(`/api/auctions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete auction");

      alert("ลบการประมูลเรียบร้อยแล้ว");
      router.push("/admin/auctions");
    } catch (error) {
      console.error("Error deleting auction:", error);
      alert(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการลบการประมูล");
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  }

  async function handleCloseAuction() {
    if (!id || !confirm("คุณต้องการปิดการประมูลนี้หรือไม่?")) return;
    setLoading((prev) => ({ ...prev, close: true }));
    try {
      const res = await fetch(`/api/auctions/${id}/close`, { method: "POST" });
      
      if (!res.ok) {
        // Only throw an error if the response is not ok
        throw new Error("Failed to close auction");
      }

      alert("ปิดการประมูลเรียบร้อยแล้ว");
      router.refresh();
    } catch (error) {
      console.error("Error closing auction:", error);
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
      if (!res.ok) throw new Error("Failed to update auction end time");

      alert("อัปเดตเวลาสิ้นสุดการประมูลเรียบร้อยแล้ว");
      router.refresh();
    } catch (error) {
      console.error("Error updating auction end time:", error);
      alert(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการอัปเดตเวลา");
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  }

  if (!id) return <p>No auction selected.</p>;
  if (loading.fetch) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!auction) return <p className="text-gray-500">Auction not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Auction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Auction Details */}
            <div>
              <h2 className="text-xl font-semibold text-blue-700">{auction.title}</h2>
              <p className="text-gray-600">{auction.description}</p>
              <p className="mt-2 font-bold text-green-600">ราคาประมูลปัจจุบัน: ฿{auction.currentPrice.toLocaleString()}</p>
              <p className="mt-2 text-sm">
                Status:{" "}
                <span
                  className={`px-2 py-1 rounded-md ${
                    auction.status === "CLOSED" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                  }`}
                >
                  {auction.status}
                </span>
              </p>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">วันที่และเวลาสิ้นสุด:</label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
                <Button
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={handleUpdateEndTime}
                  disabled={loading.update}
                >
                  {loading.update ? "กำลังอัปเดต..." : "อัปเดตเวลาสิ้นสุด"}
                </Button>
              </div>
            </div>

            {/* Auction Image */}
            <div>
              {auction.imageUrl ? (
                <Image
                  src={auction.imageUrl}
                  alt={auction.title || "Auction item image"}
                  width={500}
                  height={300}
                  className="w-full rounded-lg shadow-md object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-lg">
                  <p className="text-gray-500">No Image</p>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <Button variant="outline" onClick={() => router.push("/admin/auctions")} className="text-gray-700 border-gray-400">
              ย้อนกลับ
            </Button>

            {auction.status !== "CLOSED" && (
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