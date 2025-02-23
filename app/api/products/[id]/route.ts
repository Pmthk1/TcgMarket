import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// 📌 ดึงข้อมูลสินค้าตาม ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.card.findUnique({ where: { id: params.id } });

    if (!product) {
      return NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงสินค้า:", error);
    return NextResponse.json({ error: "ไม่สามารถดึงข้อมูลสินค้าได้" }, { status: 500 });
  }
}

// 📌 อัปเดตสินค้า
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { name, description, category, price, imageUrl } = body;

    const updatedProduct = await prisma.card.update({
      where: { id: params.id },
      data: { name, description, category, price, imageUrl },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตสินค้า:", error);
    return NextResponse.json({ error: "ไม่สามารถอัปเดตสินค้าได้" }, { status: 500 });
  }
}

// 📌 ลบสินค้า
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.card.findUnique({ where: { id: params.id } });

    if (!product) {
      return NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });
    }

    await prisma.card.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "ลบสินค้าเรียบร้อยแล้ว" });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการลบสินค้า:", error);
    return NextResponse.json({ error: "ไม่สามารถลบสินค้าได้" }, { status: 500 });
  }
}
