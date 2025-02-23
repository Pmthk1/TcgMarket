"use client";
import { useEffect, useState } from "react";
import ProductTable from "../components/ProductTable"; // ✅ ตรวจสอบว่า path ถูกต้อง
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดสินค้า:", error);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">จัดการสินค้า</h1>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => router.push('/admin/products/add')} // ✅ แก้เส้นทางให้ถูกต้อง
      >
        เพิ่มสินค้าใหม่
      </button>
      <ProductTable products={products} />
    </div>
  );
}
