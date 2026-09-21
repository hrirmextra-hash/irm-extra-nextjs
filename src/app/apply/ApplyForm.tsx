'use client';
import { useRef, useState } from 'react';

export default function ApplyForm({ jobId, jobTitle }: { jobId: number; jobTitle: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLImageElement>(null);
  const [cameraData, setCameraData] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.style.display = 'block'; }
    } catch { alert('ไม่สามารถเปิดกล้องได้'); }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
    if (videoRef.current) { videoRef.current.srcObject = null; videoRef.current.style.display = 'none'; }
  };

  const takePhoto = () => {
    if (!stream || !videoRef.current || !canvasRef.current || !previewRef.current) { alert('กรุณาเปิดกล้องก่อน'); return; }
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const img = canvas.toDataURL('image/png');
    previewRef.current.src = img;
    previewRef.current.style.display = 'block';
    setCameraData(img);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const form = e.currentTarget;
      const data = new FormData(form);
      if (cameraData) data.set('camera_photo_data', cameraData);
      const res = await fetch('/api/apply', { method: 'POST', body: data });
      const json = await res.json() as { ok: boolean; ref?: number; error?: string };
      if (json.ok) { window.location.href = `/success?ref=${json.ref}`; }
      else { setError(json.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่'); }
    } catch { setError('เกิดข้อผิดพลาด กรุณาลองใหม่'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="hidden" name="job_id" value={jobId} />

      <div className="form-section">
        <h2>ข้อมูลส่วนตัว</h2>
        <div className="form-row">
          <div className="form-group"><label>ชื่อ</label><input name="first_name" required /></div>
          <div className="form-group"><label>นามสกุล</label><input name="last_name" required /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>วันเดือนปีเกิด</label><input type="date" name="date_of_birth" /></div>
          <div className="form-group"><label>อายุ</label><input type="number" name="age" min="15" max="80" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>น้ำหนัก / ส่วนสูง</label><input name="weight_height" placeholder="เช่น 55 กก. / 165 ซม." /></div>
          <div className="form-group"><label>เชื้อชาติ</label><input name="ethnicity" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>สัญชาติ</label><input name="nationality" /></div>
          <div className="form-group"><label>ศาสนา</label><input name="religion" /></div>
        </div>
      </div>

      <div className="form-section">
        <h2>รูปถ่ายผู้สมัครงาน</h2>
        <div className="camera-box">
          <p>ใช้กล้องถ่ายภาพ หรืออัปโหลดรูปจากเครื่อง</p>
          <video ref={videoRef} autoPlay playsInline style={{ display: 'none' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <img ref={previewRef} alt="ภาพที่ถ่าย" id="preview" />
          <div className="camera-btn">
            <button type="button" onClick={startCamera}> เปิดกล้อง</button>
            <button type="button" onClick={takePhoto}> ถ่ายภาพ</button>
          </div>
          <button type="button" className="btn-stop" onClick={stopCamera}> ปิดกล้อง</button>
          <div className="form-group" style={{ marginTop: '1rem', textAlign: 'left' }}>
            <label>รูปถ่ายไม่เกิน 6 เดือน</label>
            <input type="file" name="recent_photo_file" accept="image/*" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2>ข้อมูลการศึกษา</h2>
        <div className="form-group">
          <label>ระดับการศึกษาสูงสุด</label>
          <select name="edu_level" required>
            <option value="">-- เลือก --</option>
            {['ต่ำกว่ามัธยมศึกษา','มัธยมศึกษา','ปวช.','ปวส.','ปริญญาตรี','ปริญญาโท','ปริญญาเอก'].map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div className="form-group"><label>สถาบันการศึกษา</label><input name="edu_institution" required /></div>
        <div className="form-row">
          <div className="form-group"><label>สาขาวิชา</label><input name="edu_field" /></div>
          <div className="form-group"><label>ปีที่จบ</label><input type="number" name="edu_year" min="1950" max="3000" /></div>
        </div>
        <div className="form-group"><label>แนบหลักฐานวุฒิการศึกษา</label><input type="file" name="cert_file" accept="image/*,application/pdf" /></div>
      </div>

      <div className="form-section">
        <h2>ข้อมูลเอกสารสำคัญ</h2>
        <div className="form-group"><label>เลขบัตรประชาชน</label><input name="national_id" maxLength={13} pattern="[0-9]{13}" /></div>
        <div className="form-row">
          <div className="form-group"><label>ออกให้โดย</label><input name="id_issued_by" /></div>
          <div className="form-group"><label>จังหวัด</label><input name="id_issued_province" /></div>
        </div>
        <div className="form-group"><label>แนบสำเนาบัตรประชาชน</label><input type="file" name="id_file" accept="image/*,application/pdf" /></div>
        <div className="form-group"><label>แนบเรซูเม่ / CV (PDF)</label><input type="file" name="resume_file" accept="application/pdf" required /></div>
      </div>

      <div className="form-section">
        <h2>ที่อยู่</h2>
        <div className="form-group"><label>ที่อยู่ตามทะเบียนบ้าน</label><textarea name="address" rows={3} /></div>
        <div className="form-group"><label>ที่อยู่ปัจจุบัน</label><textarea name="address_current" rows={3} /></div>
        <div className="form-group"><label>แนบสำเนาทะเบียนบ้าน</label><input type="file" name="house_reg_file" accept="image/*,application/pdf" /></div>
      </div>

      <div className="form-section">
        <h2>ข้อมูลการติดต่อ</h2>
        <div className="form-row">
          <div className="form-group"><label>เบอร์โทรศัพท์</label><input type="tel" name="phone" required /></div>
          <div className="form-group"><label>Email</label><input type="email" name="email" required /></div>
        </div>
      </div>

      <div className="form-section">
        <h2>สถานภาพทางทหาร</h2>
        <div className="checkbox-group">
          {[['exempted','ได้รับการยกเว้น'],['drafted','จับได้ใบดำ'],['rd_completed','ผ่าน รด.'],['other','อื่นๆ']].map(([v,l]) => (
            <label key={v}><input type="radio" name="military_status" value={v} /> {l}</label>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h2>ข้อมูลครอบครัว</h2>
        <div className="form-row">
          <div className="form-group"><label>ชื่อบิดา</label><input name="father_name" /></div>
          <div className="form-group"><label>ชื่อมารดา</label><input name="mother_name" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>อาชีพ</label><input name="parent_occupation" /></div>
          <div className="form-group"><label>เบอร์ติดต่อ</label><input type="tel" name="parent_contact_phone" /></div>
        </div>
      </div>

      <div className="form-section">
        <h2>สถานภาพสมรส</h2>
        <div className="checkbox-group">
          {[['single','โสด'],['married','แต่งงาน'],['widowed','หม้าย'],['divorced','หย่าร้าง']].map(([v,l]) => (
            <label key={v}><input type="radio" name="marital_status" value={v} /> {l}</label>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h2>บุคคลติดต่อกรณีฉุกเฉิน</h2>
        <div className="form-group"><label>ชื่อ / ความสัมพันธ์ / ที่อยู่</label><textarea name="emergency_contact_info" rows={3} /></div>
        <div className="form-group"><label>เบอร์โทรศัพท์</label><input type="tel" name="emergency_contact_phone" /></div>
      </div>

      <div className="form-section">
        <h2>เงินเดือนที่ต้องการ</h2>
        <div className="form-group"><label>ระบุจำนวน (บาท/เดือน)</label><input type="number" name="expected_salary" placeholder="เช่น 18000" /></div>
      </div>

      <div className="form-section">
        <h2>ข้อความเพิ่มเติม</h2>
        <div className="form-group"><textarea name="cover_note" rows={4} placeholder="ข้อความถึงทีมงาน (ถ้ามี)" /></div>
      </div>

      {error && <div className="error-msg">{error}</div>}
      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? 'กำลังส่ง...' : ' ยืนยันข้อมูลและส่งใบสมัคร'}
      </button>
    </form>
  );
}
