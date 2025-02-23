"use client";
import Image from "next/image";

interface Card {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
}

interface CardTableProps {
  cards: Card[];
  onDelete: (id: string) => Promise<void>; // ✅ เพิ่ม onDelete
}

export default function CardTable({ cards, onDelete }: CardTableProps) {
  return (
    <table className="w-full mt-4 border">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">ชื่อการ์ด</th>
          <th className="p-2 border">รายละเอียด</th>
          <th className="p-2 border">หมวดหมู่</th>
          <th className="p-2 border">ราคา</th>
          <th className="p-2 border">รูปภาพ</th>
          <th className="p-2 border">จัดการ</th>
        </tr>
      </thead>
      <tbody>
        {cards.map((card) => (
          <tr key={card.id} className="text-center">
            <td className="p-2 border">{card.name}</td>
            <td className="p-2 border">{card.description}</td>
            <td className="p-2 border">{card.category}</td>
            <td className="p-2 border">฿{card.price}</td>
            <td className="p-2 border">
              <Image
                src={card.imageUrl}
                alt={card.name}
                width={50}
                height={50}
                className="mx-auto"
              />
            </td>
            <td className="p-2 border">
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => onDelete(card.id)}
              >
                ลบ
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
