"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    const result = await signIn("credentials", {
      email: "test@example.com",  // 👈 ทดสอบด้วย Email ที่มีอยู่จริง
      password: "password123",    // 👈 และรหัสผ่านที่ตรงกับในฐานข้อมูล
      redirect: true,
      callbackUrl: "/",
    });

    if (!result?.error) {
      console.log("เข้าสู่ระบบสำเร็จ!");
    } else {
      console.error("เกิดข้อผิดพลาด:", result.error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">เข้าสู่ระบบ</h1>
      <button
        onClick={handleSignIn}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "กำลังเข้าสู่ระบบ..." : "ลงชื่อเข้าใช้"}
      </button>
    </div>
  );
}
