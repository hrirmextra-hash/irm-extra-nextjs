import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Contact() {
  return (
    <>
      <Navbar />
      <main className="section-container">
        <h1>Contact</h1>
        <div style={{ maxWidth: 700, margin: '0 auto', background: 'var(--irm-header-bg)', color: '#fff', borderRadius: 18, padding: '2.2rem' }}>
          <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1rem' }}>IRM EXTRA (สำนักงานใหญ่ภาคอีสาน)</h3>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)', margin: '1rem 0' }} />
          <p style={{ margin: '0.6rem 0', color: 'rgba(255,255,255,0.9)' }}>
            <strong style={{ color: 'var(--irm-accent)' }}> ที่อยู่:</strong> 1694 Clubhouse The Link, ถนน มานะศิลป์ ตำบลในเมือง อำเภอเมืองนครราชสีมา นครราชสีมา 30000
          </p>
          <p style={{ margin: '0.6rem 0', color: 'rgba(255,255,255,0.9)' }}>
            <strong style={{ color: 'var(--irm-accent)' }}> เบอร์โทร:</strong> 044-000-928 เวลาทำการ 08.30 น- 18.00 น
          </p>
          <p style={{ margin: '0.6rem 0', color: 'rgba(255,255,255,0.9)' }}>
            <strong style={{ color: 'var(--irm-accent)' }}> อีเมล:</strong> irmextrakorat@gmail.com - hrirmextra@gmail.com

          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
