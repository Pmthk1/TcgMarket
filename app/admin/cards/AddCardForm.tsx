"use client";
import { useState } from "react";

export default function AddCardForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    imageUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.imageUrl) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price), // แปลงเป็นตัวเลข
        }),
      });

      if (res.ok) {
        alert("เพิ่มการ์ดเรียบร้อยแล้ว!");
        setFormData({ name: "", description: "", category: "", price: "", imageUrl: "" });
      } else {
        alert("เกิดข้อผิดพลาดในการเพิ่มการ์ด");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("ไม่สามารถเพิ่มการ์ดได้");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded-lg bg-white shadow-lg">
      <input type="text" name="name" placeholder="ชื่อการ์ด" value={formData.name} onChange={handleChange} className="p-2 border rounded" />
      <textarea name="description" placeholder="รายละเอียดการ์ด" value={formData.description} onChange={handleChange} className="p-2 border rounded"></textarea>
      <input type="text" name="category" placeholder="หมวดหมู่" value={formData.category} onChange={handleChange} className="p-2 border rounded" />
      <input type="number" name="price" placeholder="ราคาเริ่มต้น" value={formData.price} onChange={handleChange} className="p-2 border rounded" />
      <input type="text" name="imageUrl" placeholder="URL รูปภาพ" value={formData.imageUrl} onChange={handleChange} className="p-2 border rounded" />
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">เพิ่มการ์ด</button>
    </form>
  );
}
