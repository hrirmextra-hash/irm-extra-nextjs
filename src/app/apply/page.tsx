export const dynamic = 'force-dynamic';
import { getDB } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ApplyForm from './ApplyForm';


export default async function Apply({ searchParams }: { searchParams: Promise<{ job_id?: string }> }) {
  const params = await searchParams;
  const jobId = parseInt(params.job_id || '0');
  const db = getDB();
  const job = await db.prepare("SELECT id, title FROM jobs WHERE id = ? AND is_open = 1").bind(jobId).first<{ id: number; title: string }>();

  if (!job) {
    return (
      <>
        <Navbar />
        <main className="section-container">
          <h1 style={{ textAlign: 'center' }}>ไม่พบตำแหน่งงานนี้</h1>
          <p style={{ textAlign: 'center', color: 'var(--irm-text-muted)' }}>ตำแหน่งนี้อาจปิดรับสมัครแล้ว หรือไม่มีอยู่จริง</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="section-container">
        <div className="apply-page">
          <h1 className="page-title">ฟอร์มสมัครงาน<span>ออนไลน์</span></h1>
          <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--irm-text-muted)' }}>
            ตำแหน่งที่สมัคร: <strong>{job.title}</strong>
          </p>
          <ApplyForm jobId={job.id} jobTitle={job.title} />
        </div>
      </main>
      <Footer />
    </>
  );
}
