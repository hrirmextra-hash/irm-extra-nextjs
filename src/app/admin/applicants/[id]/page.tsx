export const dynamic = 'force-dynamic';
import { getDB } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';
import StatusForm from './StatusForm';


type DocRow = { id: number; doc_type: string; original_filename: string; file_size: number };

export default async function ViewApplicant({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ flash?: string }> }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const { id } = await params;
  const { flash } = await searchParams;
  const appId = parseInt(id);
  const db = getDB();

  const app = await db.prepare(`
    SELECT ap.*, a.first_name, a.last_name, a.email, a.phone, a.date_of_birth, a.age,
      a.weight_height, a.ethnicity, a.nationality, a.religion, a.national_id,
      a.id_issued_by, a.id_issued_province, a.address, a.address_current,
      a.military_status, a.father_name, a.mother_name, a.parent_occupation,
      a.parent_contact_phone, a.marital_status, a.emergency_contact_info,
      a.emergency_contact_phone, a.expected_salary, a.id AS applicant_id,
      j.title AS job_title
    FROM applications ap
    JOIN applicants a ON a.id = ap.applicant_id
    JOIN jobs j ON j.id = ap.job_id
    WHERE ap.id = ?
  `).bind(appId).first<Record<string, unknown>>();

  if (!app) return <div style={{ padding: 40 }}>ไม่พบข้อมูลการสมัครรายนี้</div>;

  const applicantId = app.applicant_id as number;
  const { results: education } = await db.prepare('SELECT * FROM education WHERE applicant_id = ?').bind(applicantId).all<{ level: string; institution: string; field_of_study: string; graduation_year: number }>();
  const { results: documents } = await db.prepare('SELECT * FROM documents WHERE applicant_id = ?').bind(applicantId).all<DocRow>();
  const { results: history } = await db.prepare(`SELECT sh.*, u.full_name AS changed_by_name FROM status_history sh LEFT JOIN users u ON u.id = sh.changed_by WHERE sh.application_id = ? ORDER BY sh.changed_at DESC`).bind(appId).all<{ changed_at: string; old_status: string; new_status: string; changed_by_name: string; email_sent: number; note: string }>();

  const statusLabels: Record<string, string> = { pending: ' รอพิจารณา', reviewing: ' กำลังพิจารณา', selected: ' ผ่านการคัดเลือก', rejected: ' ไม่ผ่าน' };
  const militaryLabels: Record<string, string> = { exempted: 'ได้รับการยกเว้น', drafted: 'ผ่านการเกณฑ์แล้ว', rd_completed: 'ผ่าน รด.', other: 'อื่นๆ' };
  const maritalLabels: Record<string, string> = { single: 'โสด', married: 'แต่งงาน', widowed: 'หม้าย', divorced: 'หย่าร้าง' };
  const docLabels: Record<string, string> = { photo: 'รูปถ่าย', recent_photo: 'รูปถ่ายไม่เกิน 6 เดือน', resume: 'เรซูเม่/CV', id_card: 'สำเนาบัตรประชาชน', transcript: 'หลักฐานวุฒิการศึกษา', other: 'สำเนาทะเบียนบ้าน' };

  const photoDoc = documents.find((d: DocRow) => d.doc_type === 'photo');
  const recentPhotoDoc = documents.find((d: DocRow) => d.doc_type === 'recent_photo');

  return (
    <div className="admin-body-app">
      <AdminSidebar />
      <div className="main">
        <div className="topbar">
          <h1>{app.first_name as string} {app.last_name as string}</h1>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/admin/applicants" className="logout-btn" style={{ background: '#fff', color: '#003d26', border: '1px solid #ddd' }}>← กลับ</Link>
            <Link href={`/admin/print/${appId}`} className="logout-btn" style={{ background: '#4caf50' }} target="_blank">🖨 พิมพ์ A4</Link>
          </div>
        </div>

        {flash === 'updated' && <div className="flash-success"> อัปเดตสถานะเรียบร้อยแล้ว</div>}
        {flash === 'updated_no_email' && <div className="flash-error"> อัปเดตสถานะแล้ว </div>}

        <p style={{ marginBottom: 20 }}>ตำแหน่ง: <strong>{app.job_title as string}</strong> · <span className={`status-pill status-${app.status as string}`}>{statusLabels[app.status as string] ?? app.status as string}</span></p>

        <div className="detail-grid">
          <div className="table-box" style={{ gridColumn: 'span 2' }}>
            <h3 className="table-title"> ข้อมูลส่วนตัว</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '8px 20px' }}>
              {[
                ['วันเกิด', app.date_of_birth], ['อายุ', app.age ? `${app.age} ปี` : null],
                ['น้ำหนัก/ส่วนสูง', app.weight_height], ['เชื้อชาติ', app.ethnicity],
                ['สัญชาติ', app.nationality], ['ศาสนา', app.religion],
                ['เบอร์โทร', app.phone], ['อีเมล', app.email],
                ['เลขบัตร ปชช.', app.national_id], ['ออกให้โดย', app.id_issued_by],
                ['จังหวัด', app.id_issued_province],
              ].map(([label, val]) => val ? (
                <p key={label as string} style={{ fontSize: 14, margin: 0 }}><strong style={{ color: '#555' }}>{label as string}:</strong> {val as string}</p>
              ) : null)}
            </div>
            {Boolean(app.address) && <p style={{ fontSize: 14, marginTop: 8 }}><strong style={{ color: '#555' }}>ที่อยู่ตามทะเบียนบ้าน:</strong> {app.address as string}</p>}
            {Boolean(app.address_current) && <p style={{ fontSize: 14 }}><strong style={{ color: '#555' }}>ที่อยู่ปัจจุบัน:</strong> {app.address_current as string}</p>}
          </div>

          <div className="table-box">
            <h3 className="table-title"> สถานภาพ</h3>
            <p style={{ fontSize: 14 }}>ทหาร: {militaryLabels[app.military_status as string] ?? '-'}</p>
            <p style={{ fontSize: 14 }}>สมรส: {maritalLabels[app.marital_status as string] ?? '-'}</p>
          </div>

          <div className="table-box">
            <h3 className="table-title"> ครอบครัว</h3>
            <p style={{ fontSize: 14 }}>บิดา: {(app.father_name as string) || '-'}</p>
            <p style={{ fontSize: 14 }}>มารดา: {(app.mother_name as string) || '-'}</p>
            <p style={{ fontSize: 14 }}>อาชีพ: {(app.parent_occupation as string) || '-'}</p>
            <p style={{ fontSize: 14 }}>เบอร์: {(app.parent_contact_phone as string) || '-'}</p>
          </div>

          <div className="table-box">
            <h3 className="table-title"> ฉุกเฉิน</h3>
            <p style={{ fontSize: 14 }}>{(app.emergency_contact_info as string) || '-'}</p>
            <p style={{ fontSize: 14 }}>เบอร์: {(app.emergency_contact_phone as string) || '-'}</p>
          </div>

          <div className="table-box">
            <h3 className="table-title"> เงินเดือนที่ต้องการ</h3>
            <p style={{ fontSize: 14 }}>{app.expected_salary ? `${(app.expected_salary as number).toLocaleString()} บาท/เดือน` : '-'}</p>
          </div>

          <div className="table-box">
            <h3 className="table-title"> การศึกษา</h3>
            {education.map((e: { level: string; institution: string; field_of_study: string; graduation_year: number }, i: number) => (
              <p key={i} style={{ fontSize: 14 }}>{e.level} — {e.institution} {e.field_of_study ? `(${e.field_of_study})` : ''} {e.graduation_year ? `, ${e.graduation_year}` : ''}</p>
            ))}
          </div>

          <div className="table-box" style={{ gridColumn: 'span 2' }}>
            <h3 className="table-title"> รูปถ่าย</h3>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[{ doc: photoDoc, label: 'รูปถ่ายบุคคล' }, { doc: recentPhotoDoc, label: 'รูปถ่ายไม่เกิน 6 เดือน' }].map(({ doc, label }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 10 }}>{label}</p>
                  {doc ? (
                    <a href={`/api/file/${doc.id}`} target="_blank">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/api/file/${doc.id}`} alt={label} style={{ width: 160, height: 200, objectFit: 'cover', borderRadius: 10, boxShadow: '0 6px 20px rgba(0,0,0,0.15)', border: '3px solid #fff' }} />
                    </a>
                  ) : (
                    <div style={{ width: 160, height: 200, background: '#f5f5f5', borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: 40, border: '2px dashed #ddd' }}>👤</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="table-box">
            <h3 className="table-title"> เอกสารแนบ</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {documents.filter((d: DocRow) => !['photo', 'recent_photo'].includes(d.doc_type)).map((d: DocRow) => (
                <li key={d.id} style={{ padding: '8px 0', borderBottom: '1px dashed #eee', fontSize: 14 }}>
                  {docLabels[d.doc_type] ?? d.doc_type}: <a href={`/api/file/${d.id}`} target="_blank" style={{ color: 'var(--irm-accent)' }}>{d.original_filename}</a> ({(d.file_size / 1024).toFixed(1)} KB)
                </li>
              ))}
            </ul>
          </div>

          <div className="table-box">
            <h3 className="table-title"> ข้อความเพิ่มเติม</h3>
            <p style={{ fontSize: 14 }}>{(app.cover_note as string) || '-'}</p>
          </div>

          <div className="table-box">
            <h3 className="table-title"> เปลี่ยนสถานะ</h3>
            <StatusForm applicationId={appId} currentStatus={app.status as string} />
            <p style={{ fontSize: 13, color: '#888', marginTop: 10 }}>เปลี่ยนเป็น "ผ่าน/ไม่ผ่าน" ระบบจะส่งอีเมลแจ้งผู้สมัครอัตโนมัติ</p>
          </div>

          <div className="table-box">
            <h3 className="table-title">ประวัติการเปลี่ยนสถานะ</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {history.map((h: { changed_at: string; old_status: string; new_status: string; changed_by_name: string; email_sent: number; note: string }, i: number) => (
                <li key={i} style={{ padding: '8px 0', borderBottom: '1px dashed #eee', fontSize: 14 }}>
                  {h.changed_at} — {statusLabels[h.old_status] ?? (h.old_status || 'ใหม่')} → <strong>{statusLabels[h.new_status] ?? h.new_status}</strong>
                  {h.changed_by_name ? ` โดย ${h.changed_by_name}` : ''}
                  {h.email_sent ? ' · ส่งอีเมลแล้ว' : ''}
                  {h.note ? ` · ${h.note}` : ''}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

