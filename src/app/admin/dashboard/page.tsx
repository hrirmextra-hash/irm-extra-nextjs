export const dynamic = 'force-dynamic';
import { getDB } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';


export default async function Dashboard() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const db = getDB();
  const total = await db.prepare('SELECT COUNT(*) as n FROM applicants').first<{ n: number }>();
  const pending = await db.prepare("SELECT COUNT(*) as n FROM applications WHERE status='pending'").first<{ n: number }>();
  const selected = await db.prepare("SELECT COUNT(*) as n FROM applications WHERE status='selected'").first<{ n: number }>();
  const rejected = await db.prepare("SELECT COUNT(*) as n FROM applications WHERE status='rejected'").first<{ n: number }>();

  const { results: recent } = await db.prepare(`
    SELECT ap.id, a.first_name, a.last_name, ap.status, ap.submitted_at, j.title
    FROM applications ap
    JOIN applicants a ON a.id = ap.applicant_id
    JOIN jobs j ON j.id = ap.job_id
    ORDER BY ap.submitted_at DESC LIMIT 8
  `).all<{ id: number; first_name: string; last_name: string; status: string; submitted_at: string; title: string }>();

  const statusLabels: Record<string, string> = { pending: ' รอพิจารณา', reviewing: ' กำลังพิจารณา', selected: ' ผ่านการคัดเลือก', rejected: ' ไม่ผ่าน' };

  return (
    <div className="admin-body-app">
      <AdminSidebar />
      <div className="main">
        <div className="topbar">
          <h1>ระบบจัดการข้อมูลผู้สมัครงาน</h1>
          <span style={{ color: 'var(--irm-text-muted)', fontSize: 14 }}>ยินดีต้อนรับ, {session.full_name}</span>
        </div>

        <div className="cards">
          <div className="stat-card all"><h2>{total?.n ?? 0}</h2><p>ผู้สมัครทั้งหมด</p></div>
          <div className="stat-card pending"><h2>{pending?.n ?? 0}</h2><p>รอพิจารณา</p></div>
          <div className="stat-card success"><h2>{selected?.n ?? 0}</h2><p>ผ่านการคัดเลือก</p></div>
          <div className="stat-card reject"><h2>{rejected?.n ?? 0}</h2><p>ไม่ผ่านการคัดเลือก</p></div>
        </div>

        <div className="table-box">
          <h2 className="table-title"> รายการผู้สมัครล่าสุด</h2>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr><th>ชื่อ-นามสกุล</th><th>ตำแหน่ง</th><th>วันที่สมัคร</th><th>สถานะ</th><th>จัดการ</th></tr>
              </thead>
              <tbody>
                {recent.map((r: { id: number; first_name: string; last_name: string; status: string; submitted_at: string; title: string }) => (
                  <tr key={r.id}>
                    <td>{r.first_name} {r.last_name}</td>
                    <td>{r.title}</td>
                    <td>{new Date(r.submitted_at).toLocaleDateString('th-TH')}</td>
                    <td><span className={`status-pill status-${r.status}`}>{statusLabels[r.status] ?? r.status}</span></td>
                    <td>
                      <Link href={`/admin/applicants/${r.id}`} className="btn-sm view">ดู</Link>
                      {' '}
                      <Link href={`/admin/print/${r.id}`} className="btn-sm print" target="_blank">พิมพ์</Link>
                    </td>
                  </tr>
                ))}
                {recent.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--irm-text-muted)' }}>ยังไม่มีผู้สมัครงาน</td></tr>}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: '1rem' }}><Link href="/admin/applicants" style={{ color: 'var(--irm-accent)', fontWeight: 500 }}>ดูรายชื่อผู้สมัครทั้งหมด →</Link></p>
        </div>
      </div>
    </div>
  );
}
