import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import path from "path";
import fs from "fs";

// ฟังก์ชันตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่
const fileExists = (filePath: string): boolean => {
  try {
    // ตรวจสอบเฉพาะในโหมด production
    if (process.env.NODE_ENV === 'production') {
      return true; // ในโหมด production, เราไม่สามารถใช้ fs ได้ จึงต้องสมมติว่าไฟล์มีอยู่
    }
    
    // ในโหมด development, เราตรวจสอบไฟล์ในโฟลเดอร์ public
    const publicPath = path.join(process.cwd(), 'public', filePath);
    return fs.existsSync(publicPath);
  } catch (error) {
    console.error("Error checking file existence:", error);
    return false;
  }
};

// ฟังก์ชันช่วยสร้าง URL รูปภาพ
const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  
  // ไม่ต้องเพิ่ม /uploads/ อีกถ้ามีอยู่แล้ว
  const relativePath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  
  // ตรวจสอบว่าควรจะใช้เป็น marco.png แทนหรือไม่
  if (!fileExists(relativePath)) {
    return "/uploads/marco.png";
  }
  
  return relativePath;
};

// 🟢 GET - ดึงข้อมูลการประมูล
export async function GET(req: NextRequest, context: { params?: { id?: string } }) {
  try {
    const id = context.params?.id;
    if (!id) return NextResponse.json({ error: "Auction ID is required" }, { status: 400 });

    console.log("🔍 Fetching auction with ID:", id);

    const auction = await prisma.auction.findUnique({
      where: { id },
      include: { card: true },
    });

    if (!auction) return NextResponse.json({ error: "Auction not found" }, { status: 404 });

    // สร้าง response object ที่มี imageUrl ที่ถูกต้อง
    const response = {
      ...auction,
      card: auction.card 
        ? { 
            ...auction.card, 
            imageUrl: auction.card.imageUrl ? getImageUrl(auction.card.imageUrl) : "/uploads/marco.png"
          }
        : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("🚨 Error fetching auction details:", error);
    return NextResponse.json({ error: "Failed to fetch auction details" }, { status: 500 });
  }
}

// ⚡ PATCH - อัปเดตราคาประมูล
export async function PATCH(req: NextRequest, context: { params?: { id?: string } }) {
  try {
    const id = context.params?.id;
    if (!id) return NextResponse.json({ error: "Auction ID is required" }, { status: 400 });

    console.log("⚡ Updating bid for auction ID:", id);

    const { bidAmount } = await req.json();
    if (!bidAmount || typeof bidAmount !== "number" || isNaN(bidAmount)) {
      return NextResponse.json({ error: "Invalid bid amount" }, { status: 400 });
    }

    const auction = await prisma.auction.findUnique({ 
      where: { id },
      include: { card: true }
    });
    
    if (!auction) return NextResponse.json({ error: "Auction not found" }, { status: 404 });

    if (bidAmount <= auction.currentPrice) {
      return NextResponse.json({ error: "Bid amount must be higher than current price" }, { status: 400 });
    }

    const updatedAuction = await prisma.auction.update({
      where: { id },
      data: { currentPrice: bidAmount },
      include: { card: true }
    });

    // สร้าง response object ที่มี imageUrl ที่ถูกต้อง
    const response = {
      ...updatedAuction,
      card: updatedAuction.card 
        ? { 
            ...updatedAuction.card, 
            imageUrl: updatedAuction.card.imageUrl ? getImageUrl(updatedAuction.card.imageUrl) : "/uploads/marco.png"
          }
        : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("🚨 Error updating bid:", error);
    return NextResponse.json({ error: "Failed to place bid" }, { status: 500 });
  }
}

// 🗑 DELETE - ลบการประมูล
export async function DELETE(req: NextRequest, context: { params?: { id?: string } }) {
  try {
    const id = context.params?.id;
    if (!id) return NextResponse.json({ error: "Auction ID is required" }, { status: 400 });

    console.log("🗑 Deleting auction with ID:", id);

    await prisma.auction.delete({ where: { id } });

    return NextResponse.json({ message: "Auction deleted successfully" });
  } catch (error) {
    console.error("🚨 Error deleting auction:", error);
    return NextResponse.json({ error: "Failed to delete auction" }, { status: 500 });
  }
}