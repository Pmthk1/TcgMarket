import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // ตรวจสอบให้แน่ใจว่าคุณมีไฟล์ prisma client

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();
    const totalAuctions = await prisma.auction.count();
    const totalBids = await prisma.bid.count();

    return NextResponse.json({
      totalUsers,
      totalAuctions,
      totalBids,
    });
  } catch (error) {
    console.error("Error fetching summary data:", error);
    return NextResponse.json({ error: "Failed to fetch summary data" }, { status: 500 });
  }
}
