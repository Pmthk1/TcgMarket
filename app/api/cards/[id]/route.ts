import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function DELETE(req: NextRequest, { params }: { params: { id?: string } }) {
  try {
    const id = params.id?.trim(); // ป้องกัน space หรือ undefined

    if (!id) {
      return NextResponse.json({ error: "Missing or invalid card ID" }, { status: 400 });
    }

    const cardExists = await prisma.card.count({
      where: { id },
    });

    if (!cardExists) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    await prisma.card.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Card deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting card:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Card not found or already deleted" }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "Failed to delete card" }, { status: 500 });
  }
}
