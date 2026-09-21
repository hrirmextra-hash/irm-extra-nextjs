import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default async function Success({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const params = await searchParams;
  const ref = params.ref ? parseInt(params.ref) : null;

  return (
    <>
      <Navbar />
      <main className="section-container">
        <div className="success-wrapper">
          <div className="success-card">
            <div className="icon-box">✓</div>
            <h1>ส่งใบสมัคร<span style={{ color: 'var(--irm-accent)' }}>สำเร็จ</span></h1>
            <p style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--irm-primary)', margin: '1rem 0' }}>
              ขอบคุณที่สนใจร่วมเป็นส่วนหนึ่งกับ IRM Extra
            </p>
            <p>ระบบได้รับข้อมูลการสมัครงานของคุณเรียบร้อยแล้ว</p>
            {ref && (
              <div style={{ display: 'inline-block', margin: '1.5rem 0', padding: '0.8rem 1.8rem', background: 'var(--irm-bg-light)', color: 'var(--irm-primary)', borderRadius: 12, fontWeight: 600, border: '1px solid var(--irm-border)' }}>
                <span style={{ color: 'var(--irm-accent)' }}>●</span> เลขอ้างอิง: IRM-{new Date().getFullYear()}-{String(ref).padStart(4, '0')}
              </div>
            )}
            <p style={{ fontSize: '0.9rem', color: 'var(--irm-text-muted)', maxWidth: 450, margin: '0 auto 1.5rem' }}>
              ฝ่ายทรัพยากรบุคคล (HR) จะดำเนินการตรวจสอบเอกสารและข้อมูลของท่าน และจะติดต่อกลับเพื่อแจ้งผลภายใน 3-7 วันทำการ
            </p>
            <Link href="/" className="btn">กลับสู่หน้าหลัก</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
