"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AddProduct() {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const categories = ["Pokemon", "One Piece"]; // ✅ หมวดหมู่สินค้า

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (productImage) {
      const imageUrl = URL.createObjectURL(productImage);
      setPreviewUrl(imageUrl);
      return () => URL.revokeObjectURL(imageUrl);
    }
  }, [productImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProductImage(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!productName || !description || !price || !category || !productImage) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const formData = new FormData();
    formData.append("file", productImage);

    try {
      setUploading(true);
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(data.error || "อัปโหลดรูปไม่สำเร็จ");
      }

      const productData = {
        name: productName,
        description,
        price: parseFloat(price),
        category,
        imageUrl: data.imageUrl,
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert("เพิ่มสินค้าสำเร็จ!");
        router.push("/products");
      } else {
        alert("เกิดข้อผิดพลาด: ไม่สามารถเพิ่มสินค้าได้");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาดระหว่างอัปโหลด");
    } finally {
      setUploading(false);
    }
  };

  if (!hydrated) return null;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">เพิ่มสินค้า</h1>

      <input
        type="text"
        placeholder="ชื่อสินค้า"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <textarea
        placeholder="รายละเอียดสินค้า"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <input
        type="text"
        placeholder="ราคา (บาท)"
        value={price}
        onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
        className="border p-2 w-full mb-4"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 w-full mb-4"
      >
        <option value="">เลือกประเภทสินค้า</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />

      {previewUrl && (
        <div className="mb-4">
          <h3 className="text-lg">ตัวอย่างรูป:</h3>
          <Image src={previewUrl} alt="Preview" width={300} height={200} className="rounded-lg" unoptimized />
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full"
        disabled={uploading}
      >
        {uploading ? "กำลังอัปโหลด..." : "เพิ่มสินค้า"}
      </button>
    </div>
  );
}
