"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/app/admin/components/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function CreateAuction() {
  const router = useRouter();

  const defaultEndTime = (() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 16);
  })();

  const [formData, setFormData] = useState({
    cardName: "",
    category: "",
    description: "",
    startPrice: "",
    image: null as File | null,
    endTime: defaultEndTime,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState(0);

  useEffect(() => {
    setInputKey(Date.now());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setImageName(file.name);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreviewUrl(null);
    setImageName(null);
    setInputKey(Date.now());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.cardName || !formData.category) {
      alert("Please fill in all required fields.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("cardName", formData.cardName);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("startPrice", formData.startPrice);
    formDataToSend.append("startTime", new Date().toISOString());
    formDataToSend.append("endTime", new Date(formData.endTime).toISOString());

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await fetch("/api/auctions", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (!response.ok) {
        alert(`Error: ${data.error}`);
        return;
      }
      router.replace("/admin/auctions");
    } catch (error) {
      console.error("🚨 Error creating auction:", error);
      alert("Failed to create auction. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <AdminHeader title="Create Auction" />
      {/* ปุ่มย้อนกลับไปหน้ารายการประมูล */}
      <Button onClick={() => router.push("/admin/auctions")} className="mb-4 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
        Back to Auctions
      </Button>
      
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg space-y-4">
        <div>
          <Label>Card Name</Label>
          <Input type="text" name="cardName" value={formData.cardName} onChange={handleChange} required className="w-full border p-2 rounded-md" />
        </div>
        <div>
          <Label>Category</Label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-md"
          >
            <option value="" disabled>-- Select Category --</option>
            <option value="pokemon">Pokémon</option>
            <option value="one_piece">One Piece</option>
          </select>
        </div>
        <div>
          <Label>Description</Label>
          <Textarea name="description" value={formData.description} onChange={handleChange} required className="w-full border p-2 rounded-md" />
        </div>
        <div>
          <Label>Starting Price (฿)</Label>
          <Input type="number" name="startPrice" value={formData.startPrice} onChange={handleChange} min="1" required className="w-full border p-2 rounded-md" />
        </div>
        <div>
          <Label>Upload Image</Label>
          <div className="flex items-center space-x-2">
            <Button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={() => document.getElementById("imageUpload")?.click()}>
              Choose File
            </Button>
            <Input key={inputKey} id="imageUpload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            {imageName && <span>{imageName}</span>}
          </div>
          {previewUrl && (
            <div className="mt-3 relative inline-block">
              <Image src={previewUrl} alt="Preview" className="rounded-md shadow-md" width={150} height={150} />
              <Button type="button" onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600">✕</Button>
            </div>
          )}
        </div>
        <div>
          <Label>Auction End Time</Label>
          <Input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} required className="w-full border p-2 rounded-md" />
        </div>
        <Button type="submit" className="w-full bg-green-600 text-white py-3 rounded-md text-lg hover:bg-green-600">Create Auction</Button>
      </form>
    </div>
  );
}
