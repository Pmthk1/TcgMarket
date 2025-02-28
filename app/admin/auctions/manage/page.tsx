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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAuction() {
      if (!id) return;
      console.log("Fetching auction with ID:", id);

      try {
        const res = await fetch(`/api/auctions/${id}`);

        if (!res.ok) {
          const errorText = await res.text(); // อ่านข้อความ error จาก API
          throw new Error(`Failed to fetch auction: ${errorText}`);
        }

        const data: Auction = await res.json();
        setAuction(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching auction:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      }
    }

    fetchAuction();
  }, [id]);

  async function handleDelete() {
    if (!id) return;
    if (!confirm("คุณต้องการลบการประมูลนี้หรือไม่?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/auctions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete auction: ${errorText}`);
      }

      alert("ลบการประมูลเรียบร้อยแล้ว");
      router.push("/admin/auctions");
    } catch (error) {
      console.error("Error deleting auction:", error);
      alert(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการลบการประมูล");
    } finally {
      setLoading(false);
    }
  }

  if (!id) return <p>No auction selected.</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
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
