export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDB, getR2 } from '@/lib/db';
import { getSession } from '@/lib/auth';


export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const db = getDB();
  const r2 = getR2();

  const doc = await db.prepare('SELECT r2_key, mime_type, original_filename FROM documents WHERE id = ?').bind(parseInt(id)).first<{ r2_key: string; mime_type: string; original_filename: string }>();
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const obj = await r2.get(doc.r2_key);
  if (!obj) return NextResponse.json({ error: 'File not found in storage' }, { status: 404 });

  const headers = new Headers();
  headers.set('Content-Type', doc.mime_type);
  headers.set('Content-Disposition', `inline; filename="${doc.original_filename}"`);

  return new NextResponse(await obj.arrayBuffer(), { headers });
}
