export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { createSession, verifyPassword } from '@/lib/auth';


export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json() as { username: string; password: string };
    if (!username || !password) return NextResponse.json({ ok: false, error: 'กรุณากรอกข้อมูลให้ครบ' }, { status: 422 });

    const db = getDB();
    const user = await db.prepare('SELECT id, username, password_hash, full_name, role FROM users WHERE username = ?').bind(username.trim()).first<{ id: number; username: string; password_hash: string; full_name: string; role: string }>();

    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return NextResponse.json({ ok: false, error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
    }

    await createSession({ id: user.id, username: user.username, full_name: user.full_name, role: user.role });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    return NextResponse.json({ ok: false, error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}
