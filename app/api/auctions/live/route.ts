import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();

    const liveAuctions = await prisma.auction.findMany({
      where: {
        startTime: { lte: now }, // startTime <= ปัจจุบัน
        endTime: { gt: now }, // endTime > ปัจจุบัน
        status: { not: "CLOSED" }, // ✅ กรองเฉพาะการประมูลที่ยังไม่ปิด
      },
      include: { 
        card: { 
          select: {
            name: true, 
            imageUrl: true,
          } 
        } 
      },
    });

    // ✅ ป้องกันการส่ง imageUrl เป็นค่าว่าง
    const formattedAuctions = liveAuctions.map(auction => ({
      ...auction,
      card: auction.card
        ? {
            ...auction.card,
            imageUrl: auction.card.imageUrl?.trim() || auction.imageUrl?.trim() || null, // ใช้ imageUrl ของ card ถ้ามีค่า, ถ้าไม่มีให้ใช้ auction.imageUrl, ถ้าไม่มีเลยให้เป็น null
          }
        : null,
      imageUrl: auction.imageUrl?.trim() || null, // ป้องกัน "" และแทนที่ด้วย null
    }));

    console.log("✅ Live Auctions with Image:", formattedAuctions);

    return NextResponse.json(formattedAuctions, { status: 200 });
  } catch (error) {
    console.error("🚨 Error fetching live auctions:", error);
    return NextResponse.json(
      { error: "Failed to fetch live auctions" },
      { status: 500 }
    );
  }
}
