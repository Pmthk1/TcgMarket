import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client"; // ✅ ใช้ Enum จาก Prisma

export async function POST(req: Request) {
  try {
    const { paymentId, proofOfTransfer } = await req.json();

    if (!paymentId) {
      return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
    }

    // ตรวจสอบว่ามี Payment จริงหรือไม่
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      select: { id: true, paymentStatus: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Invalid paymentId" }, { status: 400 });
    }

    if (payment.paymentStatus !== PaymentStatus.PENDING) {
      return NextResponse.json({ error: "Payment is already processed" }, { status: 400 });
    }

    // อัปเดตสถานะการชำระเงินเป็น COMPLETED
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        paymentStatus: PaymentStatus.COMPLETED, // ✅ เปลี่ยนจาก PENDING → COMPLETED
        proofOfTransfer: proofOfTransfer || null, // บันทึกหลักฐานการโอนถ้ามี
      },
    });

    return NextResponse.json({ message: "Payment confirmed successfully", payment: updatedPayment });
  } catch (error) {
    console.error("❌ Error confirming payment:", error);
    return NextResponse.json({ error: "Internal Server Error", details: String(error) }, { status: 500 });
  }
}
