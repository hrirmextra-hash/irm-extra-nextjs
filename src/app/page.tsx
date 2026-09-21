'use client';
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

// ===== สไลด์ 7 รูป (ใส่ path/URL รูปจริงของคุณแทนตรงนี้) =====
const HERO_IMAGES = [
  '/301.png',
  '/Ph2.png',
  '/mn3.png',
  '/NT4.png',
  '/TC5.png',
  '/KS6.png',
  '/Sc7.png',
];

const INTERVAL_MS = 3500;   // ระยะเวลาต่อสไลด์ตอนเลื่อนอัตโนมัติ
const SWIPE_THRESHOLD = 50; // ลากขั้นต่ำกี่พิกเซลถึงนับว่าปัดเปลี่ยนสไลด์

const TOTAL_SLIDES = HERO_IMAGES.length + 1; // 7 รูป + 1 สไลด์ข้อความ = 8

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const startX = useRef(0);
  const deltaX = useRef(0);
  const isDragging = useRef(false);

  const goTo = (index: number) => setCurrent(((index % TOTAL_SLIDES) + TOTAL_SLIDES) % TOTAL_SLIDES);
  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [current, isPaused]);

  const handleStart = (clientX: number) => {
    isDragging.current = true;
    startX.current = clientX;
    deltaX.current = 0;
    setIsPaused(true);
  };
  const handleMove = (clientX: number) => {
    if (!isDragging.current) return;
    deltaX.current = clientX - startX.current;
  };
  const handleEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (deltaX.current > SWIPE_THRESHOLD) prev();
    else if (deltaX.current < -SWIPE_THRESHOLD) next();
    deltaX.current = 0;
    setIsPaused(false);
  };

  // สไลด์สุดท้าย (index = HERO_IMAGES.length) คือสไลด์ข้อความ/ปุ่ม ไม่ใช่รูป
  const isContentSlide = (i: number) => i === HERO_IMAGES.length;

  return (
    <>
      <Navbar />
      <main className="section-container">

        <section
          className="hero hero-slider"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => { setIsPaused(false); handleEnd(); }}
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
          style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4 / 5', maxHeight: 500, borderRadius: 10, cursor: 'grab', userSelect: 'none' }}
        >
          {/* 7 สไลด์รูปภาพ - แสดงเต็มรูปไม่ตัดขอบ */}
          {HERO_IMAGES.map((src, i) => (
            <div
              key={src}
              style={{
                position: 'absolute', inset: 0,
                background: '#1e3a3a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: i === current ? 1 : 0,
                transition: 'opacity 1.2s ease-in-out',
                pointerEvents: 'none',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          ))}

          {/* สไลด์ที่ 8: ข้อความ + ปุ่มร่วมงานกับเรา (พื้นหลังสีทึบแบบเดิม ไม่ใช่รูป) */}
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, #1e3a3a, #0f1f24)',
              opacity: isContentSlide(current) ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', color: '#fff', padding: '0 20px',
              pointerEvents: isContentSlide(current) ? 'auto' : 'none',
            }}
          >
            <h1>IRM Extra</h1>
            <p style={{ maxWidth: 600 }}>บริษัท ไอ อาร์ เอ็ม เอ็กซ์ตร้า จำกัด (IRM Extra) บริษัทในเครือ IRM ให้บริการด้านบริหารทรัพย์สินโดยทีมงานมืออาชีพ ครอบคลุมพื้นที่ภาคอีสาน</p>
            <Link href="/jobs" className="btn">ร่วมงานกับเรา</Link>
          </div>

          {/* ปุ่มลูกศรซ้าย-ขวา */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="ก่อนหน้า"
            style={{ position: 'absolute', top: '50%', left: 16, transform: 'translateY(-50%)', zIndex: 3, background: 'rgba(0,0,0,.35)', color: '#fff', border: 'none', width: 40, height: 40, borderRadius: '50%', fontSize: 24, cursor: 'pointer' }}
          >‹</button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="ถัดไป"
            style={{ position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)', zIndex: 3, background: 'rgba(0,0,0,.35)', color: '#fff', border: 'none', width: 40, height: 40, borderRadius: '50%', fontSize: 24, cursor: 'pointer' }}
          >›</button>

          {/* จุดบอกตำแหน่ง รวม 8 จุด */}
          <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'flex', gap: 8 }}>
            {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
              <span
                key={i}
                onClick={(e) => { e.stopPropagation(); goTo(i); }}
                style={{ width: 9, height: 9, borderRadius: '50%', background: i === current ? '#f5820a' : 'rgba(255,255,255,.5)', cursor: 'pointer', transition: 'background .3s' }}
              />
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2>Welcome</h2>
          <p>บริษัท ไอ อาร์ เอ็ม เอ็กซ์ตร้า จำกัด ก่อตั้งขึ้นเมื่อวันที่ 20 กรกฎาคม 2554 เป็นบริษัทในเครือ IRM ที่ให้บริการด้านบริหารทรัพย์สินอย่างครบวงจร 
          ตั้งแต่งานบริหารอาคาร งานกฎหมาย งานบัญชีการเงิน ไปจนถึงงานวิศวกรรมและซ่อมบำรุง โดยมุ่งเน้นการให้บริการในพื้นที่ภาคอีสาน</p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2>จุดเด่นของเรา</h2>
          <div className="card-grid">
            {[
              { title: '30+ ปี', desc: 'ประสบการณ์ของผู้บริหาร' },
              { title: 'Professional Team', desc: 'ทีมงานมืออาชีพ' },
              { title: 'Legal & Engineering', desc: 'ทีมกฎหมายและวิศวกรรม' },
              { title: 'Accounting System', desc: 'ระบบบัญชีและการเงิน' },
              { title: 'Fast Response', desc: 'ศูนย์รับเรื่องร้องเรียนและแก้ไขปัญหา' },
            ].map((item) => (
              <div key={item.title} className="card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>ทีมผู้บริหาร</h2>
          <div style={{ textAlign: 'center' }}>
            <img
              src="/org-chart1.png"
              alt="ทีมผู้บริหาร IRM Extra"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
            />
          </div>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>ฝ่ายบัญชี IRM Extra</h2>
          <div style={{ textAlign: 'center' }}>
            <img
              src="/org-chart2.png"
              alt="ฝ่ายบัญชี IRM Extra"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
            />
          </div>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>ฝ่ายฝ่ายบุคคล-ธุรการ </h2>
          <div style={{ textAlign: 'center' }}>
            <img
              src="/org-chart3.png"
              alt="ฝ่ายฝ่ายบุคคล-ธุรการ IRM Extra"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
            />
          </div>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>ฝ่ายการเงิน-แจ้งหนี้</h2>
          <div style={{ textAlign: 'center' }}>
            <img
              src="/org-chart4.png"
              alt="ฝ่ายการเงิน-แจ้งหนี้ IRM Extra"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
            />
          </div>
        </section>

        <section className="section-box" style={{ textAlign: 'center' }}>
          <h2>ผลงานของเรา</h2>
          <p>โครงการที่เราดูแลอยู่</p>
          <Link href="/projects" className="btn" style={{ marginTop: '1rem', display: 'inline-flex' }}>ดูผลงานทั้งหมด</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
