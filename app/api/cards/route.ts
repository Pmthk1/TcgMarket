import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabase } from "@/utils/supabase";

// 📌 ดึงการ์ดทั้งหมด
export async function GET() {
  try {
    const cards = await prisma.card.findMany();
    return NextResponse.json(cards, { status: 200 });
  } catch (error) {
    console.error("🚨 Error fetching cards:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 📌 เพิ่มการ์ดใหม่ พร้อมอัปโหลดรูปภาพไปยัง Supabase
export async function POST(req: NextRequest) {
  try {
    // Check if Supabase client is configured
    if (!supabase) {
      console.error("🚨 Supabase client not configured");
      return NextResponse.json(
        { error: "Supabase client not configured" }, 
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const name = formData.get("name")?.toString();
    const category = formData.get("category")?.toString();
    const description = formData.get("description")?.toString() || "";
    const file = formData.get("image") as File | null;

    if (!name || !category || !file) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    // 📂 ตรวจสอบไฟล์ก่อนอัปโหลด
    console.log("📂 Uploading file:", file.name, "Type:", file.type);

    // 🔹 แปลงไฟล์เป็น Buffer
    const fileBuffer = await file.arrayBuffer();

    // 🔹 อัปโหลดไฟล์ไปยัง Supabase Storage
    const filePath = `cards/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("cards")
      .upload(filePath, fileBuffer, { contentType: file.type });

    if (error) {
      console.error("🚨 Supabase Storage Error:", error);
      return NextResponse.json({ error: "ไม่สามารถอัปโหลดรูปภาพได้" }, { status: 500 });
    }

    console.log("✅ Uploaded file path:", data?.path);

    // ✅ สร้าง URL สำหรับแสดงรูป
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      console.error("🚨 NEXT_PUBLIC_SUPABASE_URL not configured");
      return NextResponse.json(
        { error: "Supabase URL not configured" }, 
        { status: 500 }
      );
    }

    const imageUrl = `${supabaseUrl}/storage/v1/object/public/cards/${data.path}`;

    // ✅ บันทึกข้อมูลการ์ดลงฐานข้อมูล
    const newCard = await prisma.card.create({
      data: { name, category, description, imageUrl },
    });

    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    console.error("🚨 Error creating card:", error);
    return NextResponse.json({ error: "ไม่สามารถเพิ่มการ์ดได้" }, { status: 500 });
  }
}