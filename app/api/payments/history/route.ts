import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // ใช้ Prisma

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // ดึงข้อมูลประวัติการชำระเงิน + รายการสินค้า
    const payments = await prisma.payment.findMany({
      where: { userId },
      include: {
        items: true, // ดึงข้อมูลสินค้าทั้งหมดในรายการชำระเงิน
      },
      orderBy: {
        paymentDate: "desc",
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}
