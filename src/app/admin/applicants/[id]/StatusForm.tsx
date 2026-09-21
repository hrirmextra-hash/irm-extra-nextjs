'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StatusForm({ applicationId, currentStatus }: { applicationId: number; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const statusLabels = { pending: ' รอพิจารณา', reviewing: ' กำลังพิจารณา', selected: ' ผ่านการคัดเลือก', rejected: ' ไม่ผ่านการคัดเลือก' };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id: applicationId, new_status: status, note }),
      });
      const json = await res.json() as { ok: boolean; email_sent: boolean };
      if (json.ok) {
        router.push(`/admin/applicants/${applicationId}?flash=${json.email_sent ? 'updated' : 'updated_no_email'}`);
        router.refresh();
      }
    } catch { alert('เกิดข้อผิดพลาด'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="status-form">
      <select value={status} onChange={e => setStatus(e.target.value)} required>
        {Object.entries(statusLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="บันทึกภายใน (ถ้ามี)" />
      <button type="submit" className="btn-sm accept" style={{ width: '100%', padding: '10px' }} disabled={loading}>
        {loading ? 'กำลังอัปเดต...' : 'อัปเดตสถานะ'}
      </button>
    </form>
  );
}
