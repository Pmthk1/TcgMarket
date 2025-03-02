import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    console.log("✅ Fetching live auctions...");
    const now = new Date();
    console.log("🕒 Current Time:", now);

    const liveAuctions = await prisma.auction.findMany({
      where: {
        startTime: { lte: now },
        endTime: { gt: now },
        status: { not: "CLOSED" },
      },
      include: {
        card: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    console.log("🔥 Raw Auctions Data:", liveAuctions);

    if (liveAuctions.length === 0) {
      console.warn("⚠️ No live auctions found!");
    }

    const formattedAuctions = liveAuctions.map((auction) => ({
      ...auction,
      card: auction.card
        ? {
            ...auction.card,
            imageUrl: auction.card.imageUrl?.trim() || auction.imageUrl?.trim() || null,
          }
        : null,
      imageUrl: auction.imageUrl?.trim() || null,
    }));

    console.log("✅ Formatted Auctions:", formattedAuctions);

    return NextResponse.json(formattedAuctions, { status: 200 });
  } catch (error) {
    console.error("🚨 Error fetching live auctions:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
