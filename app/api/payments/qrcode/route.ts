import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase";

const PROMPTPAY_ID = "0987654321"; // ✅ หมายเลข PromptPay

export async function POST(req: Request) {
  try {
    const { userId, amount, orderId, email, clerkId } = await req.json();

    console.log("📌 Data Received:", { userId, amount, orderId, email, clerkId });

    // ✅ ตรวจสอบค่าที่ส่งมา
    if (!userId || !amount || !orderId || !email || !clerkId) {
      console.error("❌ ข้อมูลไม่ครบ:", { userId, amount, orderId, email, clerkId });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (typeof amount !== "number" || amount <= 0) {
      console.error("❌ จำนวนเงินไม่ถูกต้อง:", amount);
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // ✅ ตรวจสอบว่ามีคำสั่งซื้ออยู่จริง
    const { data: existingOrder } = await supabaseAdmin
      .from("Order")
      .select("id")
      .eq("id", orderId)
      .single();

    if (!existingOrder) {
      console.error("❌ ไม่พบ Order ID:", orderId);
      return NextResponse.json({ error: "Invalid orderId" }, { status: 400 });
    }

    // ✅ ตรวจสอบว่าผู้ใช้มีอยู่จริงหรือไม่
    const { data: existingUser } = await supabaseAdmin
      .from("User")
      .select("id")
      .eq("id", userId)
      .single();

    if (!existingUser) {
      console.log("ℹ️ ผู้ใช้ไม่พบในระบบ กำลังสร้างใหม่...");
      const { data: existingClerkUser } = await supabaseAdmin
        .from("User")
        .select("id")
        .eq("clerkId", clerkId)
        .single();

      if (existingClerkUser) {
        console.error("❌ Clerk ID ซ้ำ:", clerkId);
        return NextResponse.json({ error: "Clerk ID already exists" }, { status: 400 });
      }

      const { error: insertUserError } = await supabaseAdmin
        .from("User")
        .insert([{ 
          id: userId, 
          clerkId, 
          username: `user_${userId}`, 
          email, 
          role: "user" 
        }]);

      if (insertUserError) {
        console.error("❌ สร้างผู้ใช้ล้มเหลว:", insertUserError);
        return NextResponse.json({ error: "Failed to create user", details: insertUserError.message }, { status: 500 });
      }
    }

    // ✅ ตรวจสอบว่ามีการชำระเงินที่รอดำเนินการสำหรับคำสั่งซื้อนี้หรือไม่
    const { data: existingPayment } = await supabaseAdmin
      .from("Payment")
      .select("id")
      .eq("orderId", orderId)
      .eq("paymentStatus", "pending")
      .single();

    if (existingPayment) {
      console.error("❌ คำสั่งซื้อมีการชำระเงินที่รอดำเนินการแล้ว:", orderId);
      return NextResponse.json({ error: "This order already has a pending payment" }, { status: 400 });
    }

    // ✅ สร้าง QR Code URL
    const qrCodeUrl = `https://promptpay.io/${PROMPTPAY_ID}/${amount}.png`;
    console.log("✅ QR Code URL:", qrCodeUrl);

    // ✅ บันทึกข้อมูลลง Supabase
    const { data: paymentData, error: paymentError } = await supabaseAdmin
      .from("Payment")
      .insert([
        { 
          userId, 
          amount, 
          orderId, 
          qrCodeUrl, 
          paymentStatus: "pending", 
          paymentMethod: "promptpay" 
        }
      ])
      .select()
      .single();

    if (paymentError) {
      console.error("❌ Supabase Insert Error:", paymentError);
      return NextResponse.json({ error: "Database error", details: paymentError.message }, { status: 500 });
    }

    console.log("✅ บันทึกสำเร็จ:", paymentData);
    return NextResponse.json({ qrCodeUrl, paymentId: paymentData.id });

  } catch (error: unknown) {
    console.error("❌ Server Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}
