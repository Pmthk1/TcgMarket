import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

// ✅ GET: ดึงรายการประมูลทั้งหมด (รวมข้อมูลการ์ด)
export async function GET() {
  try {
    const auctions = await prisma.auction.findMany({
      include: {
        card: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    return NextResponse.json(auctions, { status: 200 });
  } catch (error) {
    console.error("🚨 Error fetching auctions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ POST: สร้างการประมูลใหม่ พร้อมอัปโหลดรูปภาพไปยัง Supabase Storage
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // 🛠 ดึงข้อมูลจาก formData
    let cardId = formData.get("cardId")?.toString() || "";
    const cardName = formData.get("cardName")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const startPriceRaw = formData.get("startPrice");
    const startTimeRaw = formData.get("startTime");
    const endTimeRaw = formData.get("endTime");
    const image = formData.get("image") as File | null;

    // 🛠 ตรวจสอบและแปลงค่าที่จำเป็น
    const startPrice = startPriceRaw ? Number(startPriceRaw) : NaN;
    const startTime = startTimeRaw ? new Date(startTimeRaw as string) : new Date("");
    const endTime = endTimeRaw ? new Date(endTimeRaw as string) : new Date("");

    // ตรวจสอบค่าที่จำเป็น
    if (!cardName || !category || isNaN(startPrice) || isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    if (endTime <= startTime) {
      return NextResponse.json({ error: "End time must be after start time" }, { status: 400 });
    }

    // 🔹 ค้นหาหรือสร้างการ์ด
    let card = await prisma.card.findFirst({
      where: { name: cardName },
    });

    if (!card) {
      card = await prisma.card.create({
        data: {
          name: cardName,
          imageUrl: "",
          category,
        },
      });
    }

    cardId = card.id;

    // 🔹 อัปโหลดไฟล์ภาพไปยัง Supabase Storage
    let imageUrl = "";
    if (image) {
      try {
        // ✅ ตรวจสอบว่าเป็นไฟล์ภาพ
        if (!image.type.startsWith("image/")) {
          return NextResponse.json({ error: "Invalid file type. Only images are allowed." }, { status: 400 });
        }

        // ✅ ตรวจสอบตัวแปรสภาพแวดล้อม
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          console.error("🚨 Missing Supabase environment variables");
          return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        // ✅ สร้าง Supabase client
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // ✅ สร้างชื่อไฟล์ที่ไม่ซ้ำ
        const fileExt = image.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // ✅ แปลงไฟล์เป็น ArrayBuffer
        const arrayBuffer = await image.arrayBuffer();

        // ✅ อัปโหลดไปยัง Supabase Storage
        const { data, error } = await supabase.storage
          .from('auction-images')
          .upload(fileName, arrayBuffer, {
            contentType: image.type,
            upsert: false
          });

        if (error) {
          console.error("🚨 Supabase upload error:", error);
          return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
        }

        // ✅ สร้าง public URL
        imageUrl = `${supabaseUrl}/storage/v1/object/public/auction-images/${data.path}`;

      } catch (error) {
        console.error("🚨 Image upload failed:", error);
        return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
      }
    }

    // ✅ บันทึกข้อมูลลงฐานข้อมูล
    const newAuction = await prisma.auction.create({
      data: {
        cardId,
        cardName,
        description,
        category,
        startPrice,
        currentPrice: startPrice,
        startTime,
        endTime,
        status: "PENDING",
        isClosed: false,
        imageUrl,
      },
      include: {
        card: true,
      },
    });

    return NextResponse.json(newAuction, { status: 201 });
  } catch (error) {
    console.error("🚨 Error creating auction:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ PUT: ปิดการประมูล (เปลี่ยน isClosed เป็น true)
export async function PUT(req: NextRequest) {
  try {
    const { auctionId } = await req.json();

    // ✅ ค้นหาการประมูล
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      select: { isClosed: true, endTime: true },
    });

    if (!auction) {
      return NextResponse.json({ success: false, error: "Auction not found" }, { status: 404 });
    }

    if (auction.isClosed) {
      return NextResponse.json({ success: false, error: "Auction is already closed" }, { status: 400 });
    }

    // ✅ เช็คเวลาหมดประมูล
    const now = new Date();
    if (auction.endTime && now >= auction.endTime) {
      // ✅ อัปเดตสถานะเป็น "CLOSED"
      const updatedAuction = await prisma.auction.update({
        where: { id: auctionId },
        data: { isClosed: true, status: "CLOSED" },
      });

      return NextResponse.json({ success: true, auction: updatedAuction });
    }

    return NextResponse.json({ success: false, error: "Auction is still active" }, { status: 400 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}