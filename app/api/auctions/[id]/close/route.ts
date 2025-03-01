import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Missing auction ID" }, { status: 400 });
  }

  try {
    // Find the auction first
    const auction = await prisma.auction.findUnique({ where: { id } });

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    // Check if status is already CLOSED
    if (auction.status === "CLOSED") {
      return NextResponse.json(
        { message: "Auction already closed" },
        { status: 400 }
      );
    }

    // Close the auction
    const updatedAuction = await prisma.auction.update({
      where: { id },
      data: { status: "CLOSED" },
    });

    return NextResponse.json(
      { message: "Auction closed successfully", auction: updatedAuction },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚨 Error closing auction:", error);
    return NextResponse.json(
      { error: "Failed to close auction" },
      { status: 500 }
    );
  }
}