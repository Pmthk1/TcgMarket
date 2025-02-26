"use client";
import { useState, useEffect } from "react";
import CardTable from "../../admin/components/CardTable";

interface Card {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
}

export default function ManageCards() {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await fetch("/api/cards");
        const data = await response.json();
        setCards(data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดการ์ด:", error);
      }
    }
    fetchCards();
  }, []);

  async function handleDeleteCard(id: string) {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบการ์ดนี้?")) return;

    try {
      const res = await fetch(`/api/cards/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("ลบไม่สำเร็จ");

      setCards((prev) => prev.filter((card) => card.id !== id)); // อัปเดต state หลังลบ
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบการ์ด:", error);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">จัดการการ์ด</h1>
      <CardTable cards={cards} onDelete={handleDeleteCard} />
    </div>
  );
}
