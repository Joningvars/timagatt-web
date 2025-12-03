import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@/lib/db';

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[db-test] connection failed', error);
    const message =
      error instanceof Error ? error.message : 'Unknown error';
    const cause =
      error instanceof Error && error.cause instanceof Error
        ? error.cause.message
        : undefined;
    return NextResponse.json(
      { ok: false, error: message, cause },
      { status: 500 },
    );
  }
}


