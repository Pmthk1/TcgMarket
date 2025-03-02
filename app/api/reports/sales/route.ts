import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// กำหนดค่า Supabase URL และ Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // ดึงข้อมูลยอดขายจากตาราง Payment
    const { data, error } = await supabase
      .from("Payment")
      .select("created_at, amount")
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // แปลงข้อมูลให้เป็นยอดขายรายวัน
    const salesData: { [key: string]: number } = {};

    data.forEach((payment) => {
      const date = payment.created_at.split("T")[0]; // แปลง timestamp เป็นวันที่
      salesData[date] = (salesData[date] || 0) + payment.amount; // รวมยอดขายของแต่ละวัน
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
