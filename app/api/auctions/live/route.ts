import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    console.log("✅ Fetching all auctions...");
    const now = new Date();
    console.log("🕒 Current Time:", now);

    // เปลี่ยนเงื่อนไขการค้นหาให้ดึงรายการทั้งหมด แต่จัดเรียงตามสถานะและเวลา
    const allAuctions = await prisma.auction.findMany({
      include: {
        card: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' }, // แสดงรายการที่ยังเปิดก่อน (ACTIVE ก่อน CLOSED)
        { endTime: 'asc' }, // จัดเรียงตามเวลาสิ้นสุด
      ],
    });

    console.log("🔥 Raw Auctions Data:", allAuctions);

    if (allAuctions.length === 0) {
      console.warn("⚠️ No auctions found!");
    }

    const formattedAuctions = allAuctions.map((auction) => {
      // ตรวจสอบสถานะอัตโนมัติ
      const isTimeExpired = new Date(auction.endTime) < now;
      const isClosed = isTimeExpired || auction.status === "CLOSED";
      
      return {
        ...auction,
        isClosed: isClosed, // เพิ่มฟิลด์ isClosed
        status: isClosed ? "CLOSED" : "ACTIVE", // อัปเดตสถานะ
        card: auction.card
          ? {
              ...auction.card,
              imageUrl: auction.card.imageUrl?.trim() || auction.imageUrl?.trim() || null,
            }
          : null,
        imageUrl: auction.imageUrl?.trim() || null,
      };
    });

    console.log("✅ Formatted Auctions:", formattedAuctions);

    return NextResponse.json(formattedAuctions, { status: 200 });
  } catch (error) {
    console.error("🚨 Error fetching auctions:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}