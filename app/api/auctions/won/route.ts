import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AuctionStatus } from "@prisma/client";

export async function GET() {
  console.log("🔍 Fetching won auctions...");

  try {
    const wonAuctions = await prisma.auction.findMany({
      where: { status: AuctionStatus.COMPLETED }, // ใช้ ENUM ตาม Prisma Schema
      include: { card: true },
    });

    return NextResponse.json(wonAuctions);
  } catch (error) {
    console.error("🚨 Error fetching won auctions:", error);
    return NextResponse.json({ error: "Failed to fetch won auctions" }, { status: 500 });
  }
}
