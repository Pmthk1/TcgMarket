import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // กำหนดชื่อไฟล์แบบไม่ซ้ำ
    const filePath = `auction-images/${Date.now()}-${file.name}`;

    // อัปโหลดไฟล์ไปยัง Supabase Storage
    const { data, error } = await supabase.storage
      .from("auction-images")
      .upload(filePath, await file.arrayBuffer(), { contentType: file.type });

    if (error) throw error;

    // สร้าง URL รูปภาพที่สามารถเข้าถึงได้
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/auction-images/${data.path}`;

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error("🚨 Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
