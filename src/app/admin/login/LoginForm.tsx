'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json() as { ok: boolean; error?: string };
      if (json.ok) { router.push('/admin/dashboard'); router.refresh(); }
      else { setError(json.error || 'เกิดข้อผิดพลาด'); }
    } catch { setError('เกิดข้อผิดพลาด กรุณาลองใหม่'); }
    finally { setLoading(false); }
  };

  return (
    <div className="admin-login-body">
      <div className="login-box">
        <div className="logo">
          <h1>IRM <span>Extra</span></h1>
          <p>ADMIN SYSTEM</p>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="ชื่อผู้ใช้งาน" required autoFocus />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="รหัสผ่าน" required />
          </div>
          <button type="submit" disabled={loading}>{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบหลังบ้าน'}</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 25 }}>
          <a href="/" style={{ textDecoration: 'none', color: 'var(--irm-primary)', fontSize: 14 }}>← กลับหน้าหลัก</a>
        </div>
      </div>
    </div>
  );
}
