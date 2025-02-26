import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Handler สำหรับ HTTP GET (ดึงข้อมูลการประมูล)
export async function GET(req: Request, context: { params?: { id?: string } }) {
  // ใช้ params อย่างถูกต้อง โดยนำ id ออกมาทันที
  const id = context.params?.id;
  console.log("🔍 Fetching auction with ID:", id);

  if (!id) return NextResponse.json({ error: "Auction ID is required" }, { status: 400 });

  try {
    const auction = await prisma.auction.findUnique({
      where: { id },
      include: { card: true },
    });

    if (!auction) return NextResponse.json({ error: "Auction not found" }, { status: 404 });

    return NextResponse.json(auction);
  } catch (error: unknown) {
    console.error("🚨 Error fetching auction details:", error);
    
    return NextResponse.json({ error: "Failed to fetch auction details" }, { status: 500 });
  }
}

// Handler สำหรับ HTTP DELETE (ลบการประมูล)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  console.log("🗑 Deleting auction with ID:", id);

  if (!id) return NextResponse.json({ error: "Auction ID is required" }, { status: 400 });

  try {
    await prisma.auction.delete({ where: { id } });
    return NextResponse.json({ message: "Auction deleted successfully" });
  } catch (error: unknown) {
    console.error("🚨 Error deleting auction:", error);

    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Failed to delete auction" }, { status: 500 });
  }
}

// Handler สำหรับ HTTP PATCH (อัปเดตราคาประมูล)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  console.log("⚡ Updating bid for auction ID:", id);

  if (!id) return NextResponse.json({ error: "Auction ID is required" }, { status: 400 });

  try {
    const { bidAmount } = await req.json();
    if (!bidAmount || typeof bidAmount !== "number" || isNaN(bidAmount)) {
      return NextResponse.json({ error: "Invalid bid amount" }, { status: 400 });
    }

    const auction = await prisma.auction.findUnique({ where: { id } });
    if (!auction) return NextResponse.json({ error: "Auction not found" }, { status: 404 });

    if (bidAmount <= auction.currentPrice) {
      return NextResponse.json({ error: "Bid amount must be higher than current price" }, { status: 400 });
    }

    const updatedAuction = await prisma.auction.update({
      where: { id },
      data: { currentPrice: bidAmount },
    });

    return NextResponse.json(updatedAuction);
  } catch (error: unknown) {
    console.error("🚨 Error updating bid:", error);

    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Failed to place bid" }, { status: 500 });
  }
}