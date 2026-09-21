import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getDB } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  const { application_id, new_status, note } = await req.json() as { application_id: number; new_status: string; note?: string };
  const allowed = ['pending', 'reviewing', 'selected', 'rejected'];
  if (!allowed.includes(new_status)) return NextResponse.json({ ok: false, error: 'Invalid status' }, { status: 422 });

  const db = getDB();
  const app = await db.prepare('SELECT status FROM applications WHERE id = ?').bind(application_id).first<{ status: string }>();
  if (!app) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

  await db.prepare('UPDATE applications SET status = ?, updated_at = datetime(\'now\') WHERE id = ?').bind(new_status, application_id).run();
  await db.prepare('INSERT INTO status_history (application_id, old_status, new_status, changed_by, note, email_sent) VALUES (?,?,?,?,?,0)').bind(application_id, app.status, new_status, session.id, note || null).run();

  return NextResponse.json({ ok: true });
}
