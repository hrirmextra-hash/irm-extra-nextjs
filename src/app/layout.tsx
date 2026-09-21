import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IRM Extra - Property Management',
  description: 'บริษัท ไอ อาร์ เอ็ม เอ็กซ์ตร้า จำกัด บริหารทรัพย์สินมืออาชีพ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
