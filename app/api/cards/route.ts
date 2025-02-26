import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 📌 ดึงการ์ดทั้งหมด
export async function GET() {
  try {
    const cards = await prisma.card.findMany();
    return NextResponse.json(cards, { status: 200 });
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 📌 เพิ่มการ์ดใหม่
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, category, imageUrl } = body;

    if (!name || !category || !imageUrl) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    const newCard = await prisma.card.create({
      data: { name, description, category, imageUrl },
    });

    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเพิ่มการ์ด:", error);
    return NextResponse.json({ error: "ไม่สามารถเพิ่มการ์ดได้" }, { status: 500 });
  }
}
