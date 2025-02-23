import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// 📌 ดึงรายการสินค้าทั้งหมด (เพิ่ม GET)
export async function GET() {
  try {
    const products = await prisma.product.findMany(); // ❗ ตรวจสอบว่าตารางใช้ชื่อ `product` หรือ `card`
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงสินค้า:", error);
    return NextResponse.json({ error: "ไม่สามารถดึงข้อมูลสินค้าได้" }, { status: 500 });
  }
}

// 📌 เพิ่มสินค้าใหม่
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, category, price, imageUrl } = body;

    if (!name || !category || !price || !imageUrl) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({ // ❗ แก้จาก `card.create()` เป็น `product.create()`
      data: { name, description, category, price: parseFloat(price), imageUrl },
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเพิ่มสินค้า:", error);
    return NextResponse.json({ error: "ไม่สามารถเพิ่มสินค้าได้" }, { status: 500 });
  }
}
