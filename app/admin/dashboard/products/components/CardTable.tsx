import Image from "next/image";

interface Card { // ✅ กำหนด type สำหรับข้อมูลสินค้า
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
}

export default function CardTable({ cards }: { cards: Card[] }) { // ✅ กำหนด type ของ props
  return (
    <table className="w-full mt-4 border">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">ชื่อสินค้า</th>
          <th className="p-2 border">รายละเอียด</th>
          <th className="p-2 border">หมวดหมู่</th>
          <th className="p-2 border">ราคา</th>
          <th className="p-2 border">รูปภาพ</th>
          <th className="p-2 border">จัดการ</th>
        </tr>
      </thead>
      <tbody>
        {cards.map((card: Card) => ( // ✅ กำหนด type ของ card
          <tr key={card.id} className="text-center">
            <td className="p-2 border">{card.name}</td>
            <td className="p-2 border">{card.description}</td>
            <td className="p-2 border">{card.category}</td>
            <td className="p-2 border">฿{card.price}</td>
            <td className="p-2 border">
              <Image src={card.imageUrl} alt={card.name} width={50} height={50} className="mx-auto" />
            </td>
            <td className="p-2 border">
              <button className="bg-red-500 text-white px-2 py-1 rounded">ลบ</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
