import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// TODO: ใส่จำนวนยูนิตจริงแทนคำว่า null และเปลี่ยน image เป็นรูปโครงการจริง
// (path รูปแนะนำให้วางไว้ที่ /public/projects/ แล้วอ้างอิงเป็น "/projects/xxx.jpg")
const groups = [
    {
    title: 'City Link Condo',
    items: [
      { name: 'Sydney', units: 78, image: '/Sydney.png' },
      { name: 'Boston', units: 79, image: '/Boston.png' },
      { name: 'Miami', units: 73, image: '/Miami.png' },
      { name: 'Sanfran', units: 76, image: '/Sanfran.png' },
      { name: 'Milan', units: 77, image: '/Milan.png' },
      { name: 'Paris', units: 73, image: '/Paris.png' },
      { name: 'Manhattan', units: 73, image: '/Manhattan.png' },
      { name: 'Melbourne', units: 73, image: '/Melbourne.png' },
      { name: 'Madrid', units: 73, image: '/Madrid.png' },
    ],
  },
    {
    title: 'Condominium',
    items: [
      { name: 'The Change Relax Condo', units: 524, image: '/change.png' },
      { name: 'The Space Condo', units: '156-174', image: '/thespace.png' },
      { name: 'V Condo', units: 160, image: '/vcondo.png' },
      { name: 'The Change Smart Value', units: 511, image: '/thechange.png' },
    ],
  },
  {
    title: 'Khao Yai',
    items: [
      { name: 'H2O Condo เขาใหญ่', units: 63 , image: '/H2O.png' },
      { name: 'อากาศ เขาใหญ่ คอนโด', units: 98, image: '/RK.png' },
      { name: 'ชูเคร คอนโด เขาใหญ่', units: 82, image: '/SK.png' },
      { name: 'อาเรีย ปุระ คอนโด เขาใหญ่', units: 27, image: '/RL.png' },
      { name: 'บ้านเขาใหญ่ คอนโด', units: 141, image: '/BKK.png' },
      { name: 'เดอะโคลด์เม้าน์เท่น เรสซิเดนซ์', units: 43, image: '/TCM.png' },
      { name: 'บ้านชลธาร เขาใหญ่ คอนโด', units: 48, image: '/BLT.png' },
    ],
  },
  {
    title: 'Housing Estate',
    items: [
      { name: 'สิรารมย์ 5,6', units: 300, image: '/Sirarom.png' },
      { name: 'ลากูน่าวิลล์', units: 58, image: '/LN2.png' },
      { name: 'วิสต้า การ์เด้นท์', units: '175-240', image: '/ViTa.png' },
      { name: 'บียอนด์ หัวทะเล', units: 138, image: '/By.png' },
      { name: 'อาณาสรา เฟส 1', units: 172, image: '/ANSARA.png' },
      { name: 'The Empire', units: 78, image: '/theempire.png' },
      { name: 'สิรารมย์ เขาใหญ่', units: 80, image: '/SiraromKY.png' },
      { name: 'เนเทอร์ร่า พาร์ค', units: 142, image: '/NaTrala.png' },
      { name: 'เดอะ เฟิร์ส 4 บายพาส-จอหอ', units: 189, image: '/TheF.png' },
      { name: 'เดอะ เวนิส ซานมาร์โค', units: '188-192', image: '/Vn.png' },
      { name: 'ศุภาลัย เบลล่า นครราชสีมา', units: 221, image: '/Sb.png' },
      { name: 'โกลเด้น นีโอ โคราช-เทอร์มินอล', units: '491-495', image: '/Neo.png' },
    ],
  },
];

export default function Projects() {
  return (
    <>
      <Navbar />
      <main className="section-container">
        <h1>ผลงานของเรา</h1>
        <p style={{ marginBottom: '2rem', color: 'var(--irm-text-muted)' }}>
          โครงการที่เราดูแลบริหารจัดการ ครอบคลุมคอนโดมิเนียม หมู่บ้านจัดสรร และโครงการอื่นๆอีกมากมาย
        </p>

        {groups.map((g) => (
          <div key={g.title} className="section-box" style={{ marginBottom: '2rem' }}>
            <h2>{g.title}</h2>
            <div className="project-grid">
              {g.items.map((item) => (
                <div key={item.name} className="project-card">
                  <div
                    className="project-card-image"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="project-card-body">
                    <div className="project-card-name">{item.name}</div>
                    <div className="project-card-units">
                      {item.units ? `${item.units} ยูนิต` : 'ระบุจำนวนยูนิต'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <section className="section-box" style={{ textAlign: 'center' }}>
          <h2 style={{ display: 'inline-block' }}>ยังมีโครงการอื่นอีกมากมาย</h2>
          <p style={{ color: 'var(--irm-text-muted)', margin: '0 auto' }}>
            และโครงการอื่นๆที่เราดูแลอยู่อีกมากมาย ทั่วประเทศด้วยทีมงานมืออาชีพที่พร้อมดูแลใส่ใจคุณทุกรายละเอียด
          </p>
        </section>
      </main>
      <Footer />

      <style>{`
        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.2rem;
          margin-top: 1rem;
        }
        .project-card {
          background: #fff;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.05);
          transition: transform 0.15s ease;
        }
        .project-card:hover {
          transform: translateY(-3px);
        }
        .project-card-image {
          width: 100%;
          aspect-ratio: 4 / 3;
          background-color: #e8e8e8;
          background-size: cover;
          background-position: center;
        }
        .project-card-body {
          padding: 0.8rem 1rem;
        }
        .project-card-name {
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 2px;
        }
        .project-card-units {
          font-size: 0.82rem;
          color: var(--irm-text-muted, #777);
        }
      `}</style>
    </>
  );
}