"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AddProduct() {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false); // ✅ ใช้แทน isClient

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

  const handleUpload = async () => {
    if (!productImage) {
      alert("กรุณาเลือกไฟล์ก่อน");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", productImage);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadedImageUrl(data.url);
      } else {
        alert("Upload failed: " + data.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!productName || !description || !price || !uploadedImageUrl) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const productData = {
      name: productName,
      description,
      price: parseFloat(price),
      imageUrl: uploadedImageUrl,
    };

    try {
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
    }
  };

  if (!hydrated) return null; // ✅ ป้องกันปัญหา Hydration Mismatch

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
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9.]/g, "");
          setPrice(value);
        }}
        className="border p-2 w-full mb-4"
      />

      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />

      {previewUrl && (
        <div className="mb-4">
          <h3 className="text-lg">ตัวอย่างรูป:</h3>
          <Image src={previewUrl} alt="Preview" width={300} height={200} className="rounded-lg" unoptimized />
        </div>
      )}

      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full" disabled={uploading}>
        {uploading ? "กำลังอัปโหลด..." : "อัปโหลดรูปภาพ"}
      </button>

      {uploadedImageUrl && (
        <div className="mt-4">
          <h3 className="text-lg">รูปที่อัปโหลดแล้ว:</h3>
          <Image src={uploadedImageUrl} alt="Uploaded Image" width={300} height={200} className="rounded-lg" unoptimized />
        </div>
      )}

      <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full">
        เพิ่มสินค้า
      </button>
    </div>
  );
}
