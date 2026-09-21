export const dynamic = 'force-dynamic';
import { getDB } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';


export default async function Jobs() {
  const db = getDB();
  const { results: jobs } = await db.prepare(
    "SELECT id, title, department, location, employment_type FROM jobs WHERE is_open = 1 ORDER BY created_at DESC"
  ).all<{ id: number; title: string; department: string; location: string; employment_type: string }>();

  return (
    <>
      <Navbar />
      <main className="section-container">
        <section className="hero" style={{ padding: '2.5rem 2rem' }}>
          <h1>ร่วมงานกับ <span style={{ color: 'var(--irm-accent)' }}>IRM Extra</span></h1>
          <p>ร่วมเป็นส่วนหนึ่งของทีมบริหารทรัพย์สินมืออาชีพ</p>
        </section>

        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          ตำแหน่งงานที่ <span style={{ color: 'var(--irm-accent)' }}>เปิดรับสมัคร</span>
        </h2>

        {jobs.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--irm-text-muted)' }}>ขณะนี้ยังไม่มีตำแหน่งงานเปิดรับสมัคร</p>
        ) : (
          <div className="job-box">
            {jobs.map((job: { id: number; title: string; department: string; location: string; employment_type: string }) => (
              <div key={job.id} className="job">
                <div>
                  <h3>{job.title}</h3>
                  <p>{job.department}{job.location ? ` · ${job.location}` : ''} · {job.employment_type.replace('_', ' ')}</p>
                </div>
                <Link href={`/apply?job_id=${job.id}`} className="btn">สมัครตำแหน่งนี้</Link>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
