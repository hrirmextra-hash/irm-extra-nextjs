'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ applicationId }: { applicationId: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm('ยืนยันลบข้อมูลผู้สมัครคนนี้? การกระทำนี้ไม่สามารถย้อนกลับได้');
    if (!confirmed) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/applicants/${applicationId}`, { method: 'DELETE' });
      const json = await res.json() as { ok: boolean; error?: string };
      if (json.ok) {
        router.push('/admin/applicants');
        router.refresh();
      } else {
        alert(json.error || 'ลบไม่สำเร็จ');
        setLoading(false);
      }
    } catch {
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="logout-btn"
      style={{ background: '#e53e3e' }}
    >
      {loading ? 'กำลังลบ...' : '🗑 ลบข้อมูล'}
    </button>
  );
}
