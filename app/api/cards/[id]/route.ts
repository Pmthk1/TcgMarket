import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ error: "Missing card ID" }, { status: 400 });
    }

    const card = await prisma.card.findUnique({
      where: { id },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    await prisma.card.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Card deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(" Error deleting card:", error);
    return NextResponse.json({ error: "Failed to delete card" }, { status: 500 });
  }
}