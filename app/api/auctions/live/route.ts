import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Auction, Card } from "@prisma/client";

// ใช้ Prisma types มา extend เอง
type AuctionWithCard = Auction & {
  card: Pick<Card, "name" | "imageUrl"> | null;
};

export async function GET() {
  try {
    const now = new Date();

    const allAuctions: AuctionWithCard[] = await prisma.auction.findMany({
      include: {
        card: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: [
        { status: "asc" },
        { endTime: "asc" },
      ],
    });

    const formatted = allAuctions.map((auction) => {
      const endTime = new Date(auction.endTime);
      const isTimeExpired = endTime < now;
      const isClosed =
        auction.isClosed === true ||
        auction.status === "CLOSED" ||
        isTimeExpired;

      // ป้องกัน null และ trim
      const rawCardUrl = auction.card?.imageUrl?.trim?.() || "";
      const rawAuctionUrl = auction.imageUrl?.trim?.() || "";
      const effectiveUrl = rawCardUrl || rawAuctionUrl || null;

      return {
        ...auction,
        isClosed,
        status: isClosed ? "CLOSED" : auction.status ?? "ACTIVE",
        card: auction.card
          ? {
              ...auction.card,
              imageUrl: effectiveUrl,
            }
          : null,
        imageUrl: effectiveUrl,
      };
    });

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("🚨 Error fetching auctions:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
