import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// 📌 เพิ่มการ์ดใหม่
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, category, price, imageUrl } = body;

    if (!name || !category || !price || !imageUrl) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    const newCard = await prisma.card.create({
      data: { name, description, category, price: parseFloat(price), imageUrl },
    });

    return NextResponse.json(newCard);
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเพิ่มการ์ด:", error);
    return NextResponse.json({ error: "ไม่สามารถเพิ่มการ์ดได้" }, { status: 500 });
  }
}
