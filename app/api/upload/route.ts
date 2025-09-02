import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    // ตรวจสอบ environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase configuration");
      return NextResponse.json(
        { error: "Supabase client not configured" },
        { status: 500 }
      );
    }

    // สร้าง Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

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
    const imageUrl = `${supabaseUrl}/storage/v1/object/public/auction-images/${data.path}`;

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error("🚨 Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}