export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
export async function POST(req: NextRequest) {
  try {
    const db = getDB();
    const count = await db.prepare('SELECT COUNT(*) as n FROM users').first<{ n: number }>();
    if (count && count.n >= 10) return NextResponse.json({ ok: false, error: 'สร้างบัญชีแอดมินครบ 10 คนแล้ว ไม่สามารถสร้างเพิ่มได้' }, { status: 403 });
    const { username, email, full_name, password } = await req.json() as { username: string; email: string; full_name: string; password: string };
    if (!username || !email || !full_name || !password || password.length < 10) {
      return NextResponse.json({ ok: false, error: 'ข้อมูลไม่ครบหรือรหัสผ่านสั้นเกินไป (ต้องมีอย่างน้อย 10 ตัวอักษร)' }, { status: 422 });
    }
    const hash = await hashPassword(password);
    await db.prepare('INSERT INTO users (username, email, password_hash, full_name, role) VALUES (?,?,?,?,?)').bind(username.trim(), email.trim(), hash, full_name.trim(), 'admin').run();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[SETUP ERROR]', err);
    return NextResponse.json({ ok: false, error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}
