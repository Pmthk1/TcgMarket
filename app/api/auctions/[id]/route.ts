import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ฟังก์ชันช่วยสร้าง URL รูปภาพ
const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  
  // ไม่ต้องเพิ่ม /uploads/ อีกถ้ามีอยู่แล้ว
  return imagePath.startsWith("/") ? imagePath : `/uploads/${imagePath}`;
};

// 🟢 GET - ดึงข้อมูลการประมูล
export async function GET(req: NextRequest) {
  try {
    // Extract the ID from the URL path instead of using params
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
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
            imageUrl: auction.card.imageUrl ? getImageUrl(auction.card.imageUrl) : null
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
export async function PATCH(req: NextRequest) {
  try {
    // Extract the ID from the URL path instead of using params
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
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
            imageUrl: updatedAuction.card.imageUrl ? getImageUrl(updatedAuction.card.imageUrl) : null
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
export async function DELETE(req: NextRequest) {
  try {
    // Extract the ID from the URL path instead of using params
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    if (!id) return NextResponse.json({ error: "Auction ID is required" }, { status: 400 });

    console.log("🗑 Deleting auction with ID:", id);

    await prisma.auction.delete({ where: { id } });

    return NextResponse.json({ message: "Auction deleted successfully" });
  } catch (error) {
    console.error("🚨 Error deleting auction:", error);
    return NextResponse.json({ error: "Failed to delete auction" }, { status: 500 });
  }
}