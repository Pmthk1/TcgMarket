import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AuctionStatus } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`🔍 Fetching won auctions for user: ${session.user.id}`);

    const wonAuctions = await prisma.auction.findMany({
      where: { 
        status: AuctionStatus.COMPLETED,
        winnerId: session.user.id
      },
      include: { card: true },
    });

    console.log("✅ Won Auctions:", wonAuctions);

    return NextResponse.json(wonAuctions);
  } catch (error) {
    console.error("🚨 Error fetching won auctions:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Failed to fetch won auctions" }, { status: 500 });
  }
}
