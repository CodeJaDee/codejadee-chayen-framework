import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get('userId');
  const orders = await db.order.findMany({ where: userId ? { userId } : {} });
  return NextResponse.json(orders);
}
