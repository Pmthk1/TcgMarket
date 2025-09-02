import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    // ตรวจสอบ environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase configuration");
      return NextResponse.json(
        { error: "Supabase configuration is missing" },
        { status: 500 }
      );
    }

    // สร้าง Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ดึงข้อมูล 5 อันดับการประมูลที่ถูกประมูลมากที่สุด
    const { data: bidCounts, error: bidError } = await supabase
      .rpc("get_top_auction_bids") // ใช้ฟังก์ชัน RPC ในฐานข้อมูล
      .limit(5);

    if (bidError) {
      console.error("Error fetching bid counts:", bidError);
      return NextResponse.json({ error: bidError.message }, { status: 500 });
    }

    if (!bidCounts || bidCounts.length === 0) {
      return NextResponse.json([]);
    }

    // ดึงข้อมูลรายละเอียดของการประมูลจาก Auctions
    const auctionIds = bidCounts.map((bid: { auction_id: string }) => bid.auction_id);
    const { data: auctions, error: auctionError } = await supabase
      .from("Auctions")
      .select("id, title, image")
      .in("id", auctionIds);

    if (auctionError) {
      console.error("Error fetching auctions:", auctionError);
      return NextResponse.json({ error: auctionError.message }, { status: 500 });
    }

    // รวมข้อมูลการประมูลกับจำนวนครั้งที่ถูกประมูล
    const auctionReport = bidCounts.map((bid: { auction_id: string; count: number }) => {
      const auction = auctions?.find((a: { id: string }) => a.id === bid.auction_id);
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