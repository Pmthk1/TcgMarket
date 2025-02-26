import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client"; // ✅ ใช้ Enum จาก Prisma

export async function POST(req: Request) {
  try {
    const { paymentId } = await req.json();

    if (!paymentId) {
      return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
    }

    // ✅ ใช้ Enum ที่มีอยู่ใน Prisma
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        paymentStatus: PaymentStatus.COMPLETED, // ✅ เปลี่ยนจาก CONFIRMED เป็น COMPLETED
      },
    });

    return NextResponse.json({ message: "Payment confirmed", payment: updatedPayment });
  } catch (error) {
    console.error("❌ Error confirming payment:", error);
    return NextResponse.json({ error: "Internal Server Error", details: String(error) }, { status: 500 });
  }
}
