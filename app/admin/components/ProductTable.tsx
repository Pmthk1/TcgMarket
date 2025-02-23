"use client";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
}

export default function ProductTable({ products }: { products: Product[] }) {
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
        {products.map((product) => (
          <tr key={product.id} className="text-center">
            <td className="p-2 border">{product.name}</td>
            <td className="p-2 border">{product.description}</td>
            <td className="p-2 border">{product.category}</td>
            <td className="p-2 border">฿{product.price}</td>
            <td className="p-2 border">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={50}
                height={50}
                className="mx-auto"
              />
            </td>
            <td className="p-2 border">
              <button className="bg-red-500 text-white px-2 py-1 rounded">
                ลบ
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
