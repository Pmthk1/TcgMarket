import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  // ✅ รับ Session จาก NextAuth
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ✅ ดึงข้อมูลการประมูลของผู้ใช้
    const bids = await prisma.bid.findMany({
      where: { bidderId: session.user.id },
      include: {
        auction: {
          include: { card: true },
        },
      },
      orderBy: { bidTime: "desc" },
    });

    // ✅ แปลงข้อมูลให้เหมาะสม
    const history = bids.map((bid) => ({
      id: bid.id,
      auctionId: bid.auction?.id ?? "",
      title: bid.auction?.card?.name ?? bid.auction?.cardName ?? "ไม่มีชื่อ",
      image: bid.auction?.card?.imageUrl ?? bid.auction?.imageUrl ?? "",
      bidAmount: bid.amount,
      status: bid.auction?.highestBidderId === session.user.id ? "ชนะ" : "แพ้",
      createdAt: bid.bidTime.toISOString(),
    }));

    return NextResponse.json(history);
  } catch (error) {
    console.error("❌ Error fetching bid history:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
