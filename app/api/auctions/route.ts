import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public/uploads");

// ตรวจสอบและสร้างโฟลเดอร์ `/public/uploads/` ถ้ายังไม่มี
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ GET: ดึงรายการประมูลทั้งหมด (รวมข้อมูลการ์ด)
export async function GET() {
  try {
    const auctions = await prisma.auction.findMany({
      include: {
        card: {
          select: {
            name: true,
            imageUrl: true, // ✅ ดึงรูปภาพการ์ด
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

// ✅ POST: สร้างการประมูลใหม่ พร้อมอัปโหลดรูปภาพ
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

    // 🔹 บันทึกไฟล์ภาพ
    let imageUrl = "";
    if (image) {
      try {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadDir, image.name);

        await writeFile(filePath, buffer);
        imageUrl = `/uploads/${image.name}`;
      } catch {
        console.error("🚨 Image upload failed");
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
