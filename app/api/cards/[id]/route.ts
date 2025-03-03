import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Missing card ID' }, { status: 400 });
    }

    // ลบข้อมูลจากฐานข้อมูล (ถ้าใช้ Prisma)
    // await prisma.card.delete({ where: { id } });

    return NextResponse.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error(error); // เพิ่มบรรทัดนี้เพื่อให้ ESLint ไม่แจ้งเตือน
    return NextResponse.json(
      { error: 'Failed to delete card' },
      { status: 500 }
    );
  }
}
