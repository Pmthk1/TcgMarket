import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  // บังคับให้ context.params เป็น Promise ด้วย type assertion
  const resolvedParams = await (context.params as unknown as Promise<{ id: string }>);
  const id = resolvedParams.id?.trim();

  if (!id) {
    return NextResponse.json({ error: "Missing card ID" }, { status: 400 });
  }

  const cardExists = await prisma.card.count({
    where: { id },
  });

  if (cardExists === 0) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  await prisma.card.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Card deleted successfully" }, { status: 200 });
}
