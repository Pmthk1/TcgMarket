import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    // อ่านข้อมูลไฟล์เป็น Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // อัปโหลดไฟล์ไปยัง Supabase Storage
    const filePath = `products/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from("products").upload(filePath, buffer, {
      contentType: file.type,
    });

    if (error) throw error;

    const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/products/${data.path}`;
    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    return NextResponse.json({ message: "Upload failed", error }, { status: 500 });
  }
}
