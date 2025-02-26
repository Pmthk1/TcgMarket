import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const liveAuctions = await prisma.auction.findMany({
      where: {
        endTime: { gt: new Date() },
      },
      orderBy: { endTime: "asc" },
    });

    return NextResponse.json(liveAuctions);
  } catch (error) {
    console.error("Error fetching live auctions:", error);
    return NextResponse.json({ error: "Failed to fetch live auctions" }, { status: 500 });
  }
}
