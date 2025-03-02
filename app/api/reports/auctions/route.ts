import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// กำหนดค่า Supabase URL และ Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // ดึงข้อมูล 5 อันดับการประมูลที่ถูกประมูลมากที่สุด
    const { data: bidCounts, error: bidError } = await supabase
      .rpc("get_top_auction_bids") // ใช้ฟังก์ชัน RPC ในฐานข้อมูล
      .limit(5);

    if (bidError) {
      return NextResponse.json({ error: bidError.message }, { status: 500 });
    }

    // ดึงข้อมูลรายละเอียดของการประมูลจาก Auctions
    const auctionIds = bidCounts.map((bid: { auction_id: string }) => bid.auction_id);
    const { data: auctions, error: auctionError } = await supabase
      .from("Auctions")
      .select("id, title, image")
      .in("id", auctionIds);

    if (auctionError) {
      return NextResponse.json({ error: auctionError.message }, { status: 500 });
    }

    // รวมข้อมูลการประมูลกับจำนวนครั้งที่ถูกประมูล
    const auctionReport = bidCounts.map((bid: { auction_id: string; count: number }) => {
      const auction = auctions.find((a: { id: string }) => a.id === bid.auction_id);
      return {
        id: bid.auction_id,
        title: auction?.title || "Unknown",
        image: auction?.image || "",
        bidCount: bid.count,
      };
    });

    return NextResponse.json(auctionReport);
  } catch (err) {
    console.error("Error fetching auction report:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
