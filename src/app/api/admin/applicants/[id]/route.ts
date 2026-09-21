import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getDB, getR2 } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const appId = parseInt(id);
  const db = getDB();
  const r2 = getR2();

  const app = await db.prepare('SELECT applicant_id FROM applications WHERE id = ?').bind(appId).first<{ applicant_id: number }>();
  if (!app) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

  const applicantId = app.applicant_id;

  const { results: docs } = await db.prepare('SELECT r2_key FROM documents WHERE applicant_id = ?').bind(applicantId).all<{ r2_key: string }>();
  for (const doc of docs) {
    try { await r2.delete(doc.r2_key); } catch { /* ignore storage cleanup errors */ }
  }

  await db.prepare('DELETE FROM status_history WHERE application_id = ?').bind(appId).run();
  await db.prepare('DELETE FROM documents WHERE applicant_id = ?').bind(applicantId).run();
  await db.prepare('DELETE FROM education WHERE applicant_id = ?').bind(applicantId).run();
  await db.prepare('DELETE FROM applications WHERE id = ?').bind(appId).run();
  await db.prepare('DELETE FROM applicants WHERE id = ?').bind(applicantId).run();

  return NextResponse.json({ ok: true });
}
