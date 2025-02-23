import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Prisma Client

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      await prisma.card.delete({
        where: { id: params.id },
      });
      return NextResponse.json({ message: "Card deleted successfully" });
    } catch (error) {
      console.error("Error deleting card:", error); // Log error เพื่อให้ ESLint ไม่แจ้งเตือน
      return NextResponse.json({ error: "Failed to delete card" }, { status: 500 });
    }
  }
  