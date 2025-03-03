import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface Context {
  params: { id: string };
}

export async function DELETE(req: NextRequest, context: Context) {
  try {
    const id = context.params.id?.trim();

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
  } catch (error) {
    console.error("Error deleting card:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Card not found or already deleted" }, { status: 404 });
      } else if (error.code === "P2003") {
        return NextResponse.json({ error: "Foreign key constraint failed" }, { status: 400 });
      } else if (error.code === "P2021") {
        return NextResponse.json({ error: "Table does not exist" }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Failed to delete card" }, { status: 500 });
  }
}
