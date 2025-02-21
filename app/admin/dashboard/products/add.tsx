"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, imageUrl }),
    });
    router.push("/admin/dashboard/products");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">เพิ่มสินค้า</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <input type="text" placeholder="ชื่อสินค้า" value={name} onChange={(e) => setName(e.target.value)} required className="border p-2" />
        <textarea placeholder="รายละเอียดสินค้า" value={description} onChange={(e) => setDescription(e.target.value)} required className="border p-2"></textarea>
        <input type="text" placeholder="ลิงก์รูปภาพ" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">บันทึก</button>
      </form>
    </div>
  );
}
