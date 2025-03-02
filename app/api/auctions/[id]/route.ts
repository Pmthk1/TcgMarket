import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AuctionStatus } from "@prisma/client";

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  const path = imagePath.startsWith("/")
    ? imagePath
    : imagePath.startsWith("uploads/")
    ? `/${imagePath}`
    : `/uploads/${imagePath}`;
  return `${path}?t=${Date.now()}`;
};

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "Auction ID is required" }, { status: 400 });

    console.log("🔍 Fetching auction with ID:", id);
    const auction = await prisma.auction.findUnique({ where: { id }, include: { card: true } });

    if (!auction) return NextResponse.json({ error: "Auction not found" }, { status: 404 });

    return NextResponse.json({
      ...auction,
      card: auction.card ? { ...auction.card, imageUrl: getImageUrl(auction.card.imageUrl) } : null,
      isClosed: auction.status === "CLOSED"
    });
  } catch (error) {
    console.error("🚨 Error fetching auction details:", error);
    return NextResponse.json({ error: "Failed to fetch auction details" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "Auction ID is required" }, { status: 400 });

    console.log("⚡ Updating auction ID:", id);
    const { bidAmount, endTime } = await req.json();

    const auction = await prisma.auction.findUnique({ where: { id }, include: { card: true } });
    if (!auction) return NextResponse.json({ error: "Auction not found" }, { status: 404 });

    const updateData: Partial<{ currentPrice: number; endTime: Date; status: AuctionStatus }> = {};

    if (bidAmount !== undefined) {
      if (typeof bidAmount !== "number" || isNaN(bidAmount) || bidAmount <= auction.currentPrice) {
        return NextResponse.json({ error: "Invalid bid amount" }, { status: 400 });
      }
      updateData.currentPrice = bidAmount;
      updateData.status = AuctionStatus.ACTIVE;
    }

    if (endTime) {
      updateData.endTime = new Date(endTime);
    }

    const updatedAuction = await prisma.auction.update({
      where: { id },
      data: updateData,
      include: { card: true },
    });

    return NextResponse.json({
      ...updatedAuction,
      card: updatedAuction.card ? { ...updatedAuction.card, imageUrl: getImageUrl(updatedAuction.card.imageUrl) } : null,
      isClosed: updatedAuction.status === "CLOSED"
    });
  } catch (error) {
    console.error("🚨 Error updating auction:", error);
    return NextResponse.json({ error: "Failed to update auction" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "Auction ID is required" }, { status: 400 });

    console.log("🗑 Deleting auction with ID:", id);
    await prisma.auction.delete({ where: { id } });

    return NextResponse.json({ message: "Auction deleted successfully" });
  } catch (error) {
    console.error("🚨 Error deleting auction:", error);
    return NextResponse.json({ error: "Failed to delete auction" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "Auction ID is required" }, { status: 400 });

    console.log("🔴 Closing auction with ID:", id);
    const auction = await prisma.auction.findUnique({ where: { id } });

    if (!auction) return NextResponse.json({ error: "Auction not found" }, { status: 404 });

    const updatedAuction = await prisma.auction.update({
      where: { id },
      data: { status: AuctionStatus.CLOSED },
    });

    return NextResponse.json({
      message: "Auction closed successfully",
      auction: { ...updatedAuction, isClosed: updatedAuction.status === "CLOSED" }
    });
  } catch (error) {
    console.error("🚨 Error closing auction:", error);
    return NextResponse.json({ error: "Failed to close auction" }, { status: 500 });
  }
}