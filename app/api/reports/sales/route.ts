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
        { error: "Supabase client not configured" },
        { status: 500 }
      );
    }

    // สร้าง Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ดึงข้อมูลยอดขายจากตาราง Payment
    const { data, error } = await supabase
      .from("Payment")
      .select("created_at, amount")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      console.error("No data returned from Supabase");
      return NextResponse.json({ error: "No sales data found" }, { status: 500 });
    }

    // แปลงข้อมูลให้เป็นยอดขายรายวัน
    const salesData: { [key: string]: number } = {};

    data.forEach((payment) => {
      if (payment.created_at && payment.amount != null) {
        const date = payment.created_at.split("T")[0]; // แปลง timestamp เป็นวันที่
        salesData[date] = (salesData[date] || 0) + payment.amount; // รวมยอดขายของแต่ละวัน
      } else {
        console.warn("Skipping invalid payment data:", payment);
      }
    });

    // จัดรูปแบบข้อมูลให้เป็น Array
    const formattedData = Object.keys(salesData).map((date) => ({
      date,
      total: salesData[date],
    }));

    return NextResponse.json(formattedData);
  } catch (err) {
    console.error("Error fetching sales data:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}