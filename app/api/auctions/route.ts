import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public/uploads");

// ตรวจสอบว่าโฟลเดอร์ `/public/uploads/` มีหรือยัง ถ้าไม่มีให้สร้าง
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ GET: ดึงรายการประมูลทั้งหมด
export async function GET() {
  try {
    const auctions = await prisma.auction.findMany();
    return NextResponse.json(auctions, { status: 200 });
  } catch (error) {
    console.error("🚨 Error fetching auctions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ POST: สร้างการประมูลใหม่
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // 🛠 ดึงข้อมูลจาก formData
    const cardId = formData.get("cardId") as string | null;
    const description = formData.get("description") as string | null;
    const startPriceRaw = formData.get("startPrice");
    const startTimeRaw = formData.get("startTime");
    const endTimeRaw = formData.get("endTime");
    const image = formData.get("image") as File | null;

    console.log("📩 Received Data:", { 
      cardId, 
      description, 
      startPriceRaw, 
      startTimeRaw, 
      endTimeRaw, 
      image 
    });

    // 🛠 ตรวจสอบและแปลงค่าที่จำเป็น
    const startPrice = startPriceRaw ? parseFloat(startPriceRaw as string) : NaN;
    const startTime = startTimeRaw ? new Date(startTimeRaw as string) : new Date("");
    const endTime = endTimeRaw ? new Date(endTimeRaw as string) : new Date("");

    console.log("⏳ Processed Values:", { startPrice, startTime, endTime });

    // 🛠 ตรวจสอบค่าที่จำเป็น
    if (!cardId || isNaN(startPrice) || isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      console.log("❌ Missing or invalid required fields");
      return NextResponse.json({ 
        error: "Missing or invalid required fields", 
        debug: { cardId, startPrice, startTime, endTime } 
      }, { status: 400 });
    }

    if (endTime <= startTime) {
      console.log("❌ End time must be after start time");
      return NextResponse.json({ error: "End time must be after start time" }, { status: 400 });
    }

    // 🔹 ค้นหาการ์ดจากฐานข้อมูล
    const card = await prisma.card.findUnique({ where: { id: cardId } });
    console.log("🔍 Card Lookup Result:", card);

    if (!card) {
      console.log("❌ Card not found in database");
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // ✅ บันทึกชื่อการ์ด
    const cardName = card.name;

    // 🔹 บันทึกไฟล์ภาพ
    let imageUrl: string | null = null;
    if (image) {
      try {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadDir, image.name);

        await writeFile(filePath, buffer);
        imageUrl = `/uploads/${image.name}`;
        console.log("✅ Image saved at:", imageUrl);
      } catch (imgError) {
        console.error("❌ Error saving image:", imgError);
        return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
      }
    }

    // ✅ บันทึกข้อมูลลงฐานข้อมูล
    const newAuction = await prisma.auction.create({
      data: {
        cardId,
        cardName, // ✅ เพิ่ม cardName
        description,
        startPrice,
        currentPrice: startPrice,
        startTime,
        endTime,
        status: "PENDING",
        imageUrl,
      },
    });

    console.log("✅ Auction Created:", newAuction);
    return NextResponse.json(newAuction, { status: 201 });

  } catch (error) {
    console.error("🚨 Error creating auction:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
