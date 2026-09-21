import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function About() {
  return (
    <>
      <Navbar />
      <main className="section-container">
        <h1>About Us</h1>

        <div className="section-box">
          <h2>บริษัท ไอ อาร์ เอ็ม เอ็กซ์ตร้า จำกัด</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {['บริษัทในเครือ IRM', 'ก่อตั้งวันที่ 20 กรกฎาคม 2554', 'ดำเนินธุรกิจด้านบริหารทรัพย์สิน', 'พื้นที่ดำเนินงานภาคอีสานและภาคเหนือ', 'ทุนจดทะเบียน 1,000,000 บาท'].map(item => (
              <li key={item} style={{ padding: '0.4rem 0', borderBottom: '1px dashed #eee' }}>✓ {item}</li>
            ))}
          </ul>
        </div>

        <div className="section-box">
          <h2>Vision</h2>
          <p>เป็นบริษัทให้บริการด้านบริหารทรัพย์สินโดยทีมงานมืออาชีพที่ได้รับการยอมรับสูงสุดในประเทศไทย</p>
        </div>

        <div className="section-box">
          <h2>Mission</h2>
          <ol style={{ paddingLeft: '1.25rem', color: 'var(--irm-text-muted)' }}>
            <li>พัฒนาศักยภาพด้านบุคลากรให้สามารถให้บริการได้ตามมาตรฐานสากล</li>
            <li>นำเทคโนโลยีและนวัตกรรมต่าง ๆ มาปรับใช้ เพื่อรองรับการเปลี่ยนแปลง</li>
            <li>พัฒนาการให้บริการ โดยเน้นให้ลูกค้ามีส่วนร่วมในการให้บริการ</li>
            <li>ปลูกฝังคุณธรรม ความซื่อสัตย์ และจริยธรรมในวิชาชีพ</li>
          </ol>
        </div>

        <div className="section-box">
          <h2>Core Values</h2>
          <div className="card-grid">
            {[
              { title: 'Positive Attitude', desc: 'ทัศนคติเชิงบวก' },
              { title: 'Ethics & Integrity', desc: 'คุณธรรม จรรยาบรรณ และความซื่อสัตย์' },
              { title: 'Professionalism', desc: 'ทำงานอย่างมืออาชีพและลูกค้าเป็นศูนย์กลาง' },
              { title: 'Speed & Quality', desc: 'รวดเร็วและมีคุณภาพ' },
              { title: 'Innovativeness', desc: 'สร้างสรรค์นวัตกรรม' },
              { title: 'Accept Change', desc: 'ยอมรับการเปลี่ยนแปลง' },
            ].map(item => (
              <div key={item.title} className="card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section-box">
          <h2>Why IRM Extra</h2>
          <ol style={{ paddingLeft: '1.25rem', color: 'var(--irm-text-muted)' }}>
            {['ผู้บริหารมีประสบการณ์กว่า 30 ปี', 'มีทีมกฎหมายและวิศวกรรม', 'ระบบบัญชีการเงินได้มาตรฐาน', 'ระบบรักษาความปลอดภัย', 'ระบบรักษาความสะอาด', 'ดูแลสวนและพื้นที่สีเขียว', 'ประชุมทีมงานทุกวัน', 'ศูนย์รับเรื่องร้องเรียน', 'Daily To-do List', 'รายงานจำนวนพนักงานประจำวัน'].map(item => <li key={item}>{item}</li>)}
          </ol>
        </div>
      </main>
      <Footer />
    </>
  );
}
