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
    // 🔎 ค้นหาการประมูลจากฐานข้อมูล
    const auction = await prisma.auction.findUnique({ where: { id } });

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    // 🚨 ตรวจสอบว่าการประมูลปิดไปแล้วหรือยัง
    if (auction.status === "CLOSED") {
      return NextResponse.json(
        { message: "Auction already closed" },
        { status: 400 }
      );
    }

    // ✅ ปิดการประมูลและอัปเดต `endedAt` เป็นเวลาปัจจุบัน
    const updatedAuction = await prisma.auction.update({
      where: { id },
      data: {
        status: "CLOSED",
        endedAt: new Date(), // บันทึกเวลาที่ปิดจริง
      },
    });

    console.log(`✅ Auction ${id} closed successfully.`);

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
