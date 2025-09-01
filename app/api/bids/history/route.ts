import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// ฟังก์ชันแปลง URL ของรูปภาพให้เป็น path ที่ client ใช้งานได้
function processImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http")) return imageUrl;
  return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
}

// หา user จาก Clerk หรือสร้างใหม่ถ้ายังไม่มีใน DB
async function getOrCreateUserByClerkId() {
  const clerk = await currentUser();
  if (!clerk) return null;

  let user = await prisma.user.findUnique({ where: { clerkId: clerk.id } });
  if (!user) {
    const email = clerk.emailAddresses?.[0]?.emailAddress || `${clerk.id}@example.local`;
    const usernameBase = clerk.username || clerk.firstName || "user";
    const username = `${usernameBase}-${clerk.id.slice(0, 6)}`.toLowerCase();

    user = await prisma.user.upsert({
      where: { clerkId: clerk.id },
      update: {},
      create: {
        clerkId: clerk.id,
        email,
        username,
      },
    });
  }
  return user;
}

// ✅ GET: ดึงประวัติการประมูลของ user
export async function GET() {
  try {
    const user = await getOrCreateUserByClerkId();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ดึงประวัติการ bid ทั้งหมดของ user นี้ (ใหม่สุดก่อน)
    const bids = await prisma.bid.findMany({
      where: { bidderId: user.id },
      include: {
        auction: { include: { card: true } },
      },
      orderBy: { bidTime: "desc" },
    });

    // ✅ ไม่บีบเหลือกล่องเดียวอีกแล้ว
    // เก็บ bid ของ user ทุกครั้งที่เคย bid
    const items = bids.map((b) => ({
      auctionId: b.auctionId,
      cardName: b.auction.card?.name || b.auction.cardName,
      imageUrl: processImageUrl(b.auction.imageUrl || b.auction.card?.imageUrl) || "",
      startPrice: b.auction.startPrice,
      lastBidAmount: b.amount,           // ราคาที่ user bid ตอนนั้น
      lastBidTime: b.bidTime,            // เวลา bid
      currentPrice: b.auction.currentPrice, // ราคาล่าสุดของ auction
      status: b.auction.status,
    }));

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching bid history:", error);
    return NextResponse.json({ error: "Failed to fetch bid history" }, { status: 500 });
  }
}
