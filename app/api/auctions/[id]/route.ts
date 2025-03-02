import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AuctionStatus, Auction, Card } from "@prisma/client";

// Define extended Card type with potentially nullable imageUrl (based on your actual data model)
type CardWithNullableImage = Omit<Card, 'imageUrl'> & {
  imageUrl: string | null;
};

// Define the type for auction with its related card
type AuctionWithCard = Auction & {
  card: CardWithNullableImage | null;
};

// Define the type for the return value which includes additional properties
type AuctionWithCardAndExtra = AuctionWithCard & {
  isClosed: boolean;
};

// ฟังก์ชันช่วยสร้าง URL ของรูปภาพ
const getImageUrl = (imagePath?: string | null) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  const path = imagePath.startsWith("/")
    ? imagePath
    : imagePath.startsWith("uploads/")
    ? `/${imagePath}`
    : `/uploads/${imagePath}`;
  return `${path}?t=${Date.now()}`;
};

// ✅ ฟังก์ชันตรวจสอบและอัปเดตสถานะประมูลตามเวลา
async function checkAndUpdateAuctionStatus(auction: AuctionWithCard): Promise<AuctionWithCardAndExtra> {
  // ถ้าประมูลยังไม่ปิดและเวลาสิ้นสุดน้อยกว่าเวลาปัจจุบัน ให้ปิดประมูลอัตโนมัติ
  if (auction.status !== "CLOSED" && auction.endTime && new Date(auction.endTime) < new Date()) {
    console.log(`🕒 Auto-closing auction ${auction.id} due to expired time`);
    
    const updatedAuction = await prisma.auction.update({
      where: { id: auction.id },
      data: {
        status: AuctionStatus.CLOSED,
        endedAt: new Date(),
      },
      include: { card: true }
    });
    
    return {
      ...updatedAuction,
      card: updatedAuction.card ? { ...updatedAuction.card, imageUrl: getImageUrl(updatedAuction.card.imageUrl) } : null,
      isClosed: true
    };
  }
  
  return {
    ...auction,
    card: auction.card ? { ...auction.card, imageUrl: getImageUrl(auction.card.imageUrl) } : null,
    isClosed: auction.status === "CLOSED" || (auction.endTime && new Date(auction.endTime) < new Date())
  };
}

// ✅ API: ดึงข้อมูลการประมูล
export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "Auction ID is required" }, { status: 400 });

    console.log("🔍 Fetching auction with ID:", id);
    const auction = await prisma.auction.findUnique({ where: { id }, include: { card: true } });

    if (!auction) return NextResponse.json({ error: "Auction not found" }, { status: 404 });

    // ตรวจสอบและอัปเดตสถานะตามเวลา
    const updatedAuction = await checkAndUpdateAuctionStatus(auction);

    return NextResponse.json(updatedAuction);
  } catch (error) {
    console.error("🚨 Error fetching auction details:", error);
    return NextResponse.json({ error: "Failed to fetch auction details" }, { status: 500 });
  }
}

// ✅ API: อัปเดตราคาและเวลาสิ้นสุด
export async function PATCH(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "Auction ID is required" }, { status: 400 });

    console.log("⚡ Updating auction ID:", id);
    const { bidAmount, endTime, status } = await req.json();

    const auction = await prisma.auction.findUnique({ where: { id }, include: { card: true } });
    if (!auction) return NextResponse.json({ error: "Auction not found" }, { status: 404 });

    const updateData: Partial<{ currentPrice: number; endTime: Date; status: AuctionStatus; endedAt: Date | null }> = {};

    if (bidAmount !== undefined) {
      if (typeof bidAmount !== "number" || isNaN(bidAmount) || bidAmount <= auction.currentPrice) {
        return NextResponse.json({ error: "Invalid bid amount" }, { status: 400 });
      }
      updateData.currentPrice = bidAmount;
      updateData.status = AuctionStatus.ACTIVE;
    }

    if (endTime) {
      updateData.endTime = new Date(endTime);
    }
    
    // ✅ อัปเดตสถานะโดยตรงถ้ามีการส่งค่ามา
    if (status) {
      updateData.status = status as AuctionStatus;
      
      // ถ้าสถานะเป็น CLOSED ให้บันทึกเวลาที่ปิด
      if (status === "CLOSED" && !auction.endedAt) {
        updateData.endedAt = new Date();
      }
    }

    const updatedAuction = await prisma.auction.update({
      where: { id },
      data: updateData,
      include: { card: true },
    });

    return NextResponse.json({
      ...updatedAuction,
      card: updatedAuction.card ? { ...updatedAuction.card, imageUrl: getImageUrl(updatedAuction.card.imageUrl) } : null,
      isClosed: updatedAuction.status === "CLOSED" || (updatedAuction.endTime && new Date(updatedAuction.endTime) < new Date()),
    });
  } catch (error) {
    console.error("🚨 Error updating auction:", error);
    return NextResponse.json({ error: "Failed to update auction" }, { status: 500 });
  }
}

// ✅ API: ลบการประมูล
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "Auction ID is required" }, { status: 400 });

    console.log("🗑 Deleting auction with ID:", id);
    await prisma.auction.delete({ where: { id } });

    return NextResponse.json({ message: "Auction deleted successfully" });
  } catch (error) {
    console.error("🚨 Error deleting auction:", error);
    return NextResponse.json({ error: "Failed to delete auction" }, { status: 500 });
  }
}

// ✅ API: ปิดการประมูล
export async function POST(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "Auction ID is required" }, { status: 400 });

    console.log("🔴 Closing auction with ID:", id);
    const auction = await prisma.auction.findUnique({ where: { id } });

    if (!auction) return NextResponse.json({ error: "Auction not found" }, { status: 404 });

    // ถ้าการประมูลปิดแล้ว ให้ส่งกลับว่า "ปิดไปแล้ว"
    if (auction.status === "CLOSED") {
      return NextResponse.json({ message: "Auction already closed" }, { status: 400 });
    }

    const updatedAuction = await prisma.auction.update({
      where: { id },
      data: {
        status: AuctionStatus.CLOSED,
        endedAt: new Date(), // ✅ เพิ่มเวลาที่ปิดประมูล
      },
    });

    return NextResponse.json({
      message: "Auction closed successfully",
      auction: { ...updatedAuction, isClosed: true }
    });
  } catch (error) {
    console.error("🚨 Error closing auction:", error);
    return NextResponse.json({ error: "Failed to close auction" }, { status: 500 });
  }
}