import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // ใช้ Prisma แทน Supabase

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    console.log("📌 API Debug: userId =", userId);

    if (!userId) {
      console.error("🚨 Missing userId in request");
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // 🔍 ดึงข้อมูลจาก Prisma
    const payments = await prisma.payment.findMany({
      where: { userId },
      include: {
        items: true, // ต้องมี relation `items` ใน schema.prisma
      },
      orderBy: {
        paymentDate: "desc",
      },
    });    

    console.log("✅ API Response:", payments);
    return NextResponse.json(payments);
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}
