"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProfilePage() {
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ข้ามการตรวจสอบ API แล้วไปหน้าหลักเลย
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen pt-10">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Your Profile</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <input
          type="text"
          name="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          required
          className="w-full border rounded px-3 py-2 mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Create Profile
        </button>
      </form>
    </div>
  );
}