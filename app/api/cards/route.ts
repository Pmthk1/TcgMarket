import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

// ✅ ตรวจสอบว่า ENV โหลดสำเร็จหรือไม่
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error("🚨 Missing Supabase credentials in environment variables.");
}

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

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
    const formData = await req.formData();
    const name = formData.get("name")?.toString();
    const category = formData.get("category")?.toString();
    const description = formData.get("description")?.toString() || "";
    const file = formData.get("image") as File | null;

    if (!name || !category || !file) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    // ✅ ตรวจสอบว่า Supabase ถูกตั้งค่าหรือไม่
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      return NextResponse.json({ error: "Supabase configuration error" }, { status: 500 });
    }

    // 🔹 อัปโหลดไฟล์ไปยัง Supabase Storage
    const filePath = `cards/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("cards")
      .upload(filePath, await file.arrayBuffer(), { contentType: file.type });

    if (error) {
      console.error("🚨 Supabase Storage Error:", error);
      return NextResponse.json({ error: "ไม่สามารถอัปโหลดรูปภาพได้" }, { status: 500 });
    }

    const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/cards/${data.path}`;

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
