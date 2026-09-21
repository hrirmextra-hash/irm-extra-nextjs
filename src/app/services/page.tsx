import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const services = [
  { emoji: '', title: 'การบริหารทรัพย์สิน', items: ['บริหารอาคารชุด', 'บริหารบ้านจัดสรร', 'บริหารเซอร์วิสอพาร์ทเมนท์', 'บริหารหอพักนักศึกษา', 'บริหารอาคารสวัสดิการ'] },
  { emoji: '', title: 'งานกฎหมายและให้คำปรึกษา', items: ['ให้คำปรึกษาด้านการบริหาร', 'ให้คำแนะนำด้านกฎหมาย', 'จัดทำ/ปรับปรุงกฎระเบียบ', 'ให้คำปรึกษาด้านนิติกรรมและสัญญา'] },
  { emoji: '', title: 'บัญชีและการเงิน', items: ['วางระบบบัญชี', 'วางระบบการเงิน', 'ออกใบแจ้งค่าใช้จ่าย', 'รายงานรายรับ-รายจ่าย', 'ตรวจสอบยอดค้างชำระ'] },
  { emoji: '', title: 'วิศวกรรมและซ่อมบำรุง', items: ['ระบบไฟฟ้า', 'ระบบประปา', 'ระบบปรับอากาศ', 'ระบบลิฟต์', 'CCTV', 'Preventive Maintenance'] },
  { emoji: '', title: 'ความปลอดภัย', items: ['กำหนดมาตรการรักษาความปลอดภัย', 'ควบคุมการปฏิบัติงาน', 'ดูแลความปลอดภัยในชีวิตและทรัพย์สิน'] },
  { emoji: '', title: 'รักษาความสะอาดและภูมิทัศน์', items: ['ควบคุมงานทำความสะอาด', 'ดูแลพื้นที่ส่วนกลาง', 'ดูแลสวนและพื้นที่สีเขียว'] },
  { emoji: '', title: 'งานบุคคล', items: ['สรรหาและคัดเลือกพนักงาน', 'ฝึกอบรม', 'ดูแลสวัสดิการ'] },
  { emoji: '', title: 'ประชาสัมพันธ์และกิจกรรม', items: ['ประชาสัมพันธ์ข่าวสาร', 'รายงานผลการดำเนินงาน', 'จัดกิจกรรมสำหรับผู้อยู่อาศัย'] },
];

export default function Services() {
  return (
    <>
      <Navbar />
      <main className="section-container">
        <h1>Services</h1>
        <p style={{ marginBottom: '2rem', color: 'var(--irm-text-muted)' }}>เราให้บริการบริหารทรัพย์สินอย่างครบวงจร ครอบคลุมทุกด้านที่จำเป็น</p>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {services.map(s => (
            <div key={s.title} className="section-box">
              <h2>{s.emoji} {s.title}</h2>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '0.5rem' }}>
                {s.items.map(item => (
                  <li key={item} style={{ padding: '0.4rem 0', borderBottom: '1px dashed var(--irm-border)', color: 'var(--irm-text)' }}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
