import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // ✅ ตรวจสอบว่า import ถูกต้อง

export async function GET() {
  try {
    // นับจำนวนคำสั่งซื้อทั้งหมด
    const totalOrders = await prisma.order.count();

    // คำนวณยอดขายรวมจาก totalAmount ใน Order
    const totalSales = await prisma.order.aggregate({
      _sum: { totalAmount: true },
    });

    // นับจำนวนการประมูลทั้งหมด
    const totalAuctions = await prisma.auction.count();

    // นับจำนวนผู้ใช้ทั้งหมด
    const totalUsers = await prisma.user.count();

    return NextResponse.json({
      totalOrders,
      totalSales: totalSales._sum?.totalAmount || 0, // ✅ ใช้ ?. ป้องกัน undefined
      totalAuctions,
      totalUsers,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
