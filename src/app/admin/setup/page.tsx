'use client';
import { useState } from 'react';

export default function SetupAdmin() {
  const [form, setForm] = useState({ username: '', email: '', full_name: '', password: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json() as { ok: boolean; error?: string };
      if (json.ok) { setDone(true); }
      else { setError(json.error || 'เกิดข้อผิดพลาด'); }
    } catch { setError('เกิดข้อผิดพลาด'); }
    finally { setLoading(false); }
  };

  return (
    <div className="admin-login-body">
      <div className="login-box">
        <div className="logo">
          <h1>IRM <span>Extra</span></h1>
          <p>ADMIN SETUP</p>
        </div>
        {done ? (
          <>
            <div className="success-msg"> สร้างบัญชีแอดมินสำเร็จแล้ว</div>
            <a href="/admin/login" className="btn" style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}>ไปหน้าเข้าสู่ระบบ</a>
          </>
        ) : (
          <>
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={handleSubmit}>
              {[
                { label: 'Username', key: 'username', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'ชื่อ-นามสกุล', key: 'full_name', type: 'text' },
                { label: 'Password (อย่างน้อย 10 ตัวอักษร)', key: 'password', type: 'password' },
              ].map(f => (
                <div key={f.key} className="form-group">
                  <label>{f.label}</label>
                  <input type={f.type} value={form[f.key as keyof typeof form]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required minLength={f.key === 'password' ? 10 : undefined} />
                </div>
              ))}
              <button type="submit" disabled={loading}>{loading ? 'กำลังสร้าง...' : 'สร้างบัญชีแอดมิน'}</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}