import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const auctionId = formData.get("auctionId") as string | null;
    const cardId = formData.get("cardId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const filePath = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("auction-images")
      .upload(filePath, await file.arrayBuffer(), { contentType: file.type });

    if (uploadError) throw uploadError;

    // ✅ ใช้ getPublicUrl() แทนการต่อ string เอง
    const { data: urlData } = supabase.storage
      .from("auction-images")
      .getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    // ✅ บันทึกลง DB (แล้วแต่ context)
    if (auctionId) {
      await prisma.auction.update({
        where: { id: auctionId },
        data: { imageUrl },
      });
    }
    if (cardId) {
      await prisma.card.update({
        where: { id: cardId },
        data: { imageUrl },
      });
    }

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error("🚨 Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}