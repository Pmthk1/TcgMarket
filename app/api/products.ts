import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // ✅ Prisma Client

export async function GET() {
  const cards = await prisma.card.findMany(); // ✅ เปลี่ยนจาก product → card
  return NextResponse.json(cards);
}

export async function POST(req: Request) {
  const { name, description, category, imageUrl, price } = await req.json();
  const card = await prisma.card.create({ // ✅ product → card
    data: { name, description, category, imageUrl, price },
  });
  return NextResponse.json(card);
}
