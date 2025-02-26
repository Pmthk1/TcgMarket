"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Auction {
  id: string;
  title: string;
  status: string;
}

export default function ManageAuction() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAuction() {
      if (!id) return;
      try {
        const res = await fetch(`/api/auctions/${id}`);
        if (!res.ok) throw new Error("Failed to fetch auction");
        const data: Auction = await res.json();
        setAuction(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchAuction();
  }, [id]);

  async function handleDelete() {
    if (!id) return;
    const confirmDelete = confirm("คุณต้องการลบการประมูลนี้หรือไม่?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/auctions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete auction");
      
      alert("ลบการประมูลเรียบร้อยแล้ว");
      router.push("/admin/auctions"); // กลับไปที่หน้ารายการประมูล
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการลบการประมูล");
    } finally {
      setLoading(false);
    }
  }

  if (!id) return <p>No auction selected.</p>;
  if (!auction) return <p>Loading...</p>;

  return (
    <div>
      <h1>Manage Auction: {auction.title}</h1>
      <p>Status: {auction.status}</p>
      <div className="flex gap-4 mt-4">
        <Button variant="destructive" onClick={handleDelete} disabled={loading}>
          {loading ? "กำลังลบ..." : "Delete Auction"}
        </Button>
      </div>
    </div>
  );
}
