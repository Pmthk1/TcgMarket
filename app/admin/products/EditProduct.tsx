"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditProduct({ productId }: { productId: string }) {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    imageUrl: "",
  });
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      setProduct(data);
    }
    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ ...product, price: parseFloat(product.price) }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("อัปเดตสินค้าสำเร็จ!");
      router.refresh();
    } else {
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">แก้ไขสินค้า</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} className="w-full p-2 border" />
        <input type="text" value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} className="w-full p-2 border" />
        <input type="text" value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} className="w-full p-2 border" />
        <input type="number" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} className="w-full p-2 border" />
        <input type="text" value={product.imageUrl} onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })} className="w-full p-2 border" />
        <button type="submit" className="bg-yellow-500 text-white px-4 py-2">อัปเดตสินค้า</button>
      </form>
    </div>
  );
}
