import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // รอให้ได้ค่า params ซึ่งตอนนี้เป็น Promise<{ id: string }>
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: 'Missing card ID' }, { status: 400 });
  }

  try {
    const cardExists = await prisma.card.count({ where: { id } });
    if (cardExists === 0) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    await prisma.card.delete({ where: { id } });
    return NextResponse.json({ message: 'Card deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}
