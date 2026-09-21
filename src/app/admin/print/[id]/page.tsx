export const dynamic = 'force-dynamic';
import { getDB } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PrintButton from './PrintButton';

export default async function PrintApplicant({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const { id } = await params;
  const appId = parseInt(id);
  const db = getDB();

  const app = await db.prepare(`
    SELECT ap.*, a.*, a.id AS applicant_id, j.title AS job_title
    FROM applications ap JOIN applicants a ON a.id = ap.applicant_id JOIN jobs j ON j.id = ap.job_id WHERE ap.id = ?
  `).bind(appId).first<Record<string, unknown>>();

  if (!app) return <div style={{ padding: 40 }}>ไม่พบข้อมูลการสมัคร</div>;

  const applicantId = app.applicant_id as number;
  const edu = await db.prepare('SELECT * FROM education WHERE applicant_id = ? LIMIT 1').bind(applicantId).first<{ level: string; institution: string; field_of_study: string; graduation_year: number }>();
  const recentPhoto = await db.prepare("SELECT id FROM documents WHERE applicant_id = ? AND doc_type = 'recent_photo' ORDER BY uploaded_at DESC LIMIT 1").bind(applicantId).first<{ id: number }>();

  const militaryLabels: Record<string, string> = { exempted: 'ได้รับการยกเว้น', drafted: 'จับได้ใบดำ', rd_completed: 'ผ่าน รด.', other: 'อื่นๆ' };
  const maritalLabels: Record<string, string> = { single: 'โสด', married: 'แต่งงาน', widowed: 'หม้าย', divorced: 'หย่าร้าง' };

  const v = (val: unknown, suffix = '') => (val === null || val === undefined || val === '') ? '-' : `${val}${suffix}`;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Kanit', sans-serif; background: #f8f9fa; color: #111; }
        .topbar { background: #fff; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 30px; }
        .topbar h1 { color: #003d26; font-size: 20px; }
        .print-btn { background: #ff7a00; color: #fff; border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer; font-family: 'Kanit',sans-serif; font-size: 15px; }
        .application { background: #fff; padding: 50px; border-radius: 20px; max-width: 950px; margin: 0 auto 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .app-header { text-align: center; margin-bottom: 35px; border-bottom: 2px dashed #e2e8f0; padding-bottom: 25px; }
        .app-header h1 { font-size: 32px; color: #003d26; font-weight: 700; }
        .app-header h1 span { color: #ff7a00; }
        .app-header h2 { font-size: 18px; color: #555; font-weight: 400; margin-top: 5px; }
        .photo-wrap { display: flex; justify-content: flex-end; margin-bottom: -15px; }
        .photo { width: 120px; height: 150px; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #f1f5f9; }
        .photo img { width: 100%; height: 100%; object-fit: cover; }
        .section { margin-bottom: 25px; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; background: #fafafa; }
        .section-title { color: #003d26; font-size: 16px; font-weight: 600; margin-bottom: 15px; padding-bottom: 6px; border-bottom: 2px solid #ff7a00; display: inline-block; }
        .row-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px,1fr)); gap: 10px; }
        .print-row { font-size: 14.5px; line-height: 1.6; color: #333; }
        .print-row strong { display: inline-block; width: 170px; color: #555; font-weight: 500; }
        .signature { margin-top: 50px; display: flex; justify-content: space-between; gap: 40px; padding: 0 20px; }
        .signature div { text-align: center; width: 250px; font-size: 14.5px; color: #333; }
        @media print {
          .topbar { display: none !important; }
          body { background: #fff; }
          .application { max-width: none; width: 100%; box-shadow: none; border-radius: 0; padding: 0; }
          .section { background: #fff !important; border: 1px solid #ccc !important; page-break-inside: avoid; }
        }
      `}</style>

      <div className="topbar no-print">
        <h1>พิมพ์เอกสารใบสมัคร</h1>
        <PrintButton />
      </div>

      <div className="application">
        <div className="app-header">
          <h1>IRM <span>EXTRA</span></h1>
          <h2>ใบสมัครงาน (Job Application Form)</h2>
        </div>

        <div className="photo-wrap">
          <div className="photo">
            {recentPhoto
              ? <img src={`/api/file/${recentPhoto.id}`} alt="รูปถ่าย" />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: 40 }}>👤</div>}
          </div>
        </div>

        <div className="section">
          <div className="section-title">ข้อมูลบุคคล</div>
          <div className="row-grid">
            <div className="print-row"><strong>ชื่อ - นามสกุล :</strong> {v(app.first_name)} {v(app.last_name)}</div>
            <div className="print-row"><strong>วัน/เดือน/ปีเกิด :</strong> {v(app.date_of_birth)}</div>
            <div className="print-row"><strong>อายุ :</strong> {v(app.age, ' ปี')}</div>
            <div className="print-row"><strong>น้ำหนัก/ส่วนสูง :</strong> {v(app.weight_height)}</div>
            <div className="print-row"><strong>เชื้อชาติ/สัญชาติ :</strong> {v(app.ethnicity)}/{v(app.nationality)}</div>
            <div className="print-row"><strong>ศาสนา :</strong> {v(app.religion)}</div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">การศึกษา</div>
          <div className="row-grid">
            <div className="print-row"><strong>ระดับการศึกษา :</strong> {edu ? v(edu.level) : '-'}</div>
            <div className="print-row"><strong>สถาบัน :</strong> {edu ? v(edu.institution) : '-'}</div>
            <div className="print-row"><strong>สาขาวิชา :</strong> {edu ? v(edu.field_of_study) : '-'}</div>
            <div className="print-row"><strong>ปีที่จบ :</strong> {edu ? v(edu.graduation_year) : '-'}</div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">เอกสารและที่อยู่</div>
          <div className="print-row"><strong>เลขบัตร ปชช. :</strong> {v(app.national_id)}</div>
          <div className="row-grid" style={{ marginTop: 5 }}>
            <div className="print-row"><strong>ออกให้โดย :</strong> {v(app.id_issued_by)}</div>
            <div className="print-row"><strong>จังหวัด :</strong> {v(app.id_issued_province)}</div>
          </div>
          <div className="print-row" style={{ marginTop: 5 }}><strong>ที่อยู่ตามทะเบียนบ้าน :</strong> {v(app.address)}</div>
          <div className="print-row"><strong>ที่อยู่ปัจจุบัน :</strong> {v(app.address_current)}</div>
        </div>

        <div className="section">
          <div className="section-title">ติดต่อ</div>
          <div className="row-grid">
            <div className="print-row"><strong>เบอร์โทร :</strong> {v(app.phone)}</div>
            <div className="print-row"><strong>อีเมล :</strong> {v(app.email)}</div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">สถานภาพทางทหาร</div>
          <div className="row-grid">
            {Object.entries(militaryLabels).map(([k, l]) => (
              <div key={k} className="print-row">[{app.military_status === k ? ' X ' : '   '}] {l}</div>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-title">ครอบครัว</div>
          <div className="print-row"><strong>สถานภาพสมรส :</strong> {maritalLabels[app.marital_status as string] ?? '-'}</div>
          <div className="row-grid" style={{ marginTop: 5 }}>
            <div className="print-row"><strong>ชื่อบิดา :</strong> {v(app.father_name)}</div>
            <div className="print-row"><strong>ชื่อมารดา :</strong> {v(app.mother_name)}</div>
            <div className="print-row"><strong>อาชีพ :</strong> {v(app.parent_occupation)}</div>
            <div className="print-row"><strong>เบอร์ :</strong> {v(app.parent_contact_phone)}</div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">ฉุกเฉิน</div>
          <div className="print-row"><strong>ผู้ติดต่อ :</strong> {v(app.emergency_contact_info)}</div>
          <div className="print-row"><strong>เบอร์ :</strong> {v(app.emergency_contact_phone)}</div>
        </div>

        <div className="section">
          <div className="section-title">เงินเดือนที่ต้องการ</div>
          <div className="print-row"><strong>ระบุ :</strong> {v(app.expected_salary, ' บาท/เดือน')}</div>
        </div>

        <div className="signature">
          <div>
            <p>ลงชื่อ..........................................................ผู้สมัคร</p>
            <p style={{ marginTop: 8 }}>( {app.first_name as string} {app.last_name as string} )</p>
            <p style={{ marginTop: 5, color: '#777', fontSize: 13 }}>วันที่......./......./.......</p>
          </div>
          <div>
            <p>ลงชื่อ..........................................................ผู้ตรวจสอบ</p>
            <p style={{ marginTop: 8 }}>( .......................................................... )</p>
            <p style={{ marginTop: 5, color: '#777', fontSize: 13 }}>วันที่......./......./.......</p>
          </div>
        </div>
      </div>
    </>
  );
}
