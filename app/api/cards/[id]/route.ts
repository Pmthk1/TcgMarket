import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Prisma Client

export async function DELETE(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    await prisma.card.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("🚨 Error deleting card:", error);
    return NextResponse.json({ error: "Failed to delete card" }, { status: 500 });
  }
}
