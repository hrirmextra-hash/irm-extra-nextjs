'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header>
      <nav className="navbar">
        <Link href="/" className="company-name">IRM <span>EXTRA</span></Link>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? '✕' : '☰'}
        </button>
        <div className={`nav-menu${open ? ' active' : ''}`}>
          <Link href="/" onClick={() => setOpen(false)}>หน้าแรก</Link>
          <Link href="/about" onClick={() => setOpen(false)}>เกี่ยวกับเรา</Link>
          <Link href="/services" onClick={() => setOpen(false)}>บริการ</Link>
          <Link href="/projects" onClick={() => setOpen(false)}>ผลงาน</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>ติดต่อเรา</Link>
          <Link href="/jobs" className="career-btn" onClick={() => setOpen(false)}>สมัครงาน</Link>
        </div>
      </nav>
    </header>
  );
}
