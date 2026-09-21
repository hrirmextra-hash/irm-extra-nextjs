'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  const links = [
    { href: '/admin/dashboard', label: ' Dashboard' },
    { href: '/admin/applicants', label: ' ผู้สมัครงาน' },
  ];

  return (
    <>
      <button className="menu-btn" onClick={() => setOpen(!open)}>☰</button>
      <div className={`overlay${open ? ' show' : ''}`} onClick={() => setOpen(false)} />
      <div className={`sidebar${open ? ' show' : ''}`}>
        <div className="logo"><h2>IRM <span>Admin</span></h2></div>
        <div className="menu">
          {links.map(l => (
            <Link key={l.href} href={l.href} className={path.startsWith(l.href) ? 'active' : ''} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <form action="/api/admin/logout" method="POST">
            <button type="submit" style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 15px', width: '100%', borderRadius: 12, fontSize: 15, fontFamily: 'Kanit,sans-serif', transition: '0.3s' }}
              onMouseOver={e => (e.currentTarget.style.background = 'var(--irm-accent)')}
              onMouseOut={e => (e.currentTarget.style.background = 'none')}>
               ออกจากระบบ
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
