import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  await prisma.card.delete({ where: { id } }); // ✅ product → card
  return NextResponse.json({ message: "Deleted" });
}
