export const dynamic = 'force-dynamic';
import { getDB } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';
import DeleteButton from './DeleteButton';

type ApplicantRow = { id: number; first_name: string; last_name: string; email: string; phone: string; status: string; submitted_at: string; title: string };

export default async function Applicants({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const params = await searchParams;
  const q = params.q?.trim() || '';
  const statusFilter = params.status || '';
  const allowed = ['pending', 'reviewing', 'selected', 'rejected'];
  const statusLabels: Record<string, string> = { pending: 'รอพิจารณา', reviewing: 'กำลังพิจารณา', selected: 'ผ่านการคัดเลือก', rejected: 'ไม่ผ่าน' };

  const db = getDB();
  let query = `SELECT ap.id, a.first_name, a.last_name, a.email, a.phone, ap.status, ap.submitted_at, j.title
    FROM applications ap JOIN applicants a ON a.id = ap.applicant_id JOIN jobs j ON j.id = ap.job_id WHERE 1=1`;
  const binds: string[] = [];

  if (q) { query += ` AND (a.first_name LIKE ? OR a.last_name LIKE ? OR a.email LIKE ? OR j.title LIKE ?)`; binds.push(...[`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`]); }
  if (statusFilter && allowed.includes(statusFilter)) { query += ` AND ap.status = ?`; binds.push(statusFilter); }
  query += ` ORDER BY ap.submitted_at DESC LIMIT 200`;

  const stmt = db.prepare(query);
  const { results } = await (binds.length ? stmt.bind(...binds) : stmt).all<ApplicantRow>();

  return (
    <div className="admin-body-app">
      <AdminSidebar />
      <div className="main">
        <div className="topbar">
          <h1>รายชื่อผู้สมัครงานทั้งหมด</h1>
          <Link href="/admin/dashboard" className="logout-btn" style={{ background: '#fff', color: '#003d26', border: '1px solid #ddd' }}>← Dashboard</Link>
        </div>

        <form method="GET" className="search-box">
          <input name="q" defaultValue={q} placeholder="ค้นหาชื่อ อีเมล ตำแหน่ง" />
          <select name="status" defaultValue={statusFilter}>
            <option value="">ทุกสถานะ</option>
            {allowed.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
          </select>
          <button type="submit" className="btn">ค้นหา</button>
        </form>

        <div className="table-box">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr><th>ชื่อ-นามสกุล</th><th>ติดต่อ</th><th>ตำแหน่ง</th><th>วันที่สมัคร</th><th>สถานะ</th><th>จัดการ</th></tr>
              </thead>
              <tbody>
                {results.map((r: ApplicantRow) => (
                  <tr key={r.id}>
                    <td>{r.first_name} {r.last_name}</td>
                    <td>{r.email}<br /><small>{r.phone}</small></td>
                    <td>{r.title}</td>
                    <td>{new Date(r.submitted_at).toLocaleDateString('th-TH')}</td>
                    <td><span className={`status-pill status-${r.status}`}>{statusLabels[r.status] ?? r.status}</span></td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <Link href={`/admin/applicants/${r.id}`} className="btn-sm view">ดูข้อมูล</Link>
                      <DeleteButton applicationId={r.id} />
                    </td>
                  </tr>
                ))}
                {results.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--irm-text-muted)' }}>ไม่พบผู้สมัครงาน</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
