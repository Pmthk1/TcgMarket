import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AuctionStatus, Auction, Card } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

// Define the type for auction with its related card
type AuctionWithCard = Auction & {
  card: Card | null;
};

// Define the type for the return value which includes additional properties
type AuctionWithCardAndExtra = AuctionWithCard & {
  isClosed: boolean;
};

// 📍 แก้ไข: ฟังก์ชันจัดการรูปภาพแบบง่าย (ไม่เดา ไม่หา)
const processImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) return null;
  
  // ถ้าเป็น URL เต็มแล้ว (http/https) ให้ใช้เลย
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }
  
  // ถ้าเป็น path ในรูปแบบ uploads/filename.ext ให้เพิ่ม / ข้างหน้า
  const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  // Return a stable URL; no cache-busting query string here.
  return path;
};

// Resolve the effective image URL, preferring auction.imageUrl then card.imageUrl
const resolveImageUrl = (auction: AuctionWithCard) => {
  const src = (auction.imageUrl && auction.imageUrl.trim() !== "")
    ? auction.imageUrl
    : (auction.card?.imageUrl ?? null);
  return processImageUrl(src);
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
    
    // 📍 แก้ไข: ใช้ processImageUrl แทน
    const processedImageUrl = resolveImageUrl(updatedAuction);
    
    return {
      ...updatedAuction,
      imageUrl: processedImageUrl || '',
      card: updatedAuction.card ? { ...updatedAuction.card, imageUrl: processedImageUrl || '' } : null,
      isClosed: true
    };
  }
  
  // 📍 แก้ไข: ใช้ processImageUrl แทน
  const processedImageUrl = resolveImageUrl(auction);
  
  return {
    ...auction,
    imageUrl: processedImageUrl || '',
    card: auction.card ? { ...auction.card, imageUrl: processedImageUrl || '' } : null,
    isClosed: auction.status === "CLOSED" || (auction.endTime && new Date(auction.endTime) < new Date())
  };
}
  

// ✅ API: ดึงข้อมูลการประมูล
export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "Auction ID is required" }, { status: 400 });

    console.log("🔍 Fetching auction with ID:", id);
    const auction = await prisma.auction.findUnique({ 
      where: { id }, 
      include: { card: true } 
    });

    if (!auction) return NextResponse.json({ error: "Auction not found" }, { status: 404 });

    // ตรวจสอบและอัปเดตสถานะตามเวลา
    const updatedAuction = await checkAndUpdateAuctionStatus(auction);

    console.log("✅ Auction data processed:", {
      id: updatedAuction.id,
      cardName: updatedAuction.card?.name,
      originalImageUrl: auction.card?.imageUrl,
      processedImageUrl: updatedAuction.card?.imageUrl
    });

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
      // Associate the highest bidder with the current Clerk user
      const clerk = await currentUser();
      if (clerk) {
        let user = await prisma.user.findUnique({ where: { clerkId: clerk.id } });
        if (!user) {
          const email = clerk.emailAddresses?.[0]?.emailAddress || `${clerk.id}@example.local`;
          const usernameBase = clerk.username || clerk.firstName || "user";
          const username = `${usernameBase}-${clerk.id.slice(0, 6)}`.toLowerCase();
          try {
            user = await prisma.user.create({ data: { clerkId: clerk.id, email, username } });
          } catch {
            user = await prisma.user.upsert({
              where: { clerkId: clerk.id },
              update: {},
              create: { clerkId: clerk.id, email: `${clerk.id}@example.local`, username: `user-${clerk.id.slice(0,8)}` },
            });
          }
        }
        // tie highest bidder to auction
        (updateData as any).highestBidderId = user.id;
      }
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

    // Record a bid item when a bid was placed successfully
    if (bidAmount !== undefined) {
      const clerk = await currentUser();
      if (clerk) {
        const user = await prisma.user.findUnique({ where: { clerkId: clerk.id } });
        if (user) {
          await prisma.bid.create({
            data: {
              auctionId: id,
              bidderId: user.id,
              amount: bidAmount,
            },
          });
        }
      }
    }

    // 📍 แก้ไข: ใช้ processImageUrl แทน
    const processedImageUrl = resolveImageUrl(updatedAuction);

    return NextResponse.json({
      ...updatedAuction,
      imageUrl: processedImageUrl || '',
      card: updatedAuction.card ? { ...updatedAuction.card, imageUrl: processedImageUrl || '' } : null,
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
