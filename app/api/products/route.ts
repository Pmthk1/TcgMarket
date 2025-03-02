import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// 📌 ดึงรายการสินค้าทั้งหมด
export async function GET() {
  try {
    const products = await prisma.product.findMany(); // ✅ ใช้ Product ตัว P ใหญ่ ตาม Prisma Schema
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

    // ตรวจสอบว่าข้อมูลครบถ้วน
    if (!name || !category || !price || !imageUrl) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description: description || "", // ถ้าไม่มี description ให้ใช้ค่าว่าง
        category,
        price: parseFloat(price),
        imageUrl,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเพิ่มสินค้า:", error);
    return NextResponse.json({ error: "ไม่สามารถเพิ่มสินค้าได้" }, { status: 500 });
  }
}
