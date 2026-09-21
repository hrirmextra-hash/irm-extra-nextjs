-- IRM Extra D1 Schema (SQLite)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK(role IN ('admin','staff')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  employment_type TEXT NOT NULL DEFAULT 'full_time' CHECK(employment_type IN ('full_time','part_time','contract','internship')),
  description TEXT,
  is_open INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS applicants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  national_id TEXT,
  id_issued_by TEXT,
  id_issued_province TEXT,
  date_of_birth TEXT,
  age INTEGER,
  weight_height TEXT,
  ethnicity TEXT,
  nationality TEXT,
  religion TEXT,
  address TEXT,
  address_current TEXT,
  military_status TEXT CHECK(military_status IN ('exempted','drafted','rd_completed','other')),
  father_name TEXT,
  mother_name TEXT,
  parent_occupation TEXT,
  parent_contact_phone TEXT,
  marital_status TEXT CHECK(marital_status IN ('single','married','widowed','divorced')),
  emergency_contact_info TEXT,
  emergency_contact_phone TEXT,
  expected_salary INTEGER,
  photo_document_id INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS education (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  applicant_id INTEGER NOT NULL REFERENCES applicants(id),
  level TEXT NOT NULL,
  institution TEXT NOT NULL,
  field_of_study TEXT,
  graduation_year INTEGER
);

CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  applicant_id INTEGER NOT NULL REFERENCES applicants(id),
  doc_type TEXT NOT NULL CHECK(doc_type IN ('photo','recent_photo','resume','id_card','transcript','other')),
  original_filename TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  applicant_id INTEGER NOT NULL REFERENCES applicants(id),
  job_id INTEGER NOT NULL REFERENCES jobs(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','reviewing','selected','rejected')),
  cover_note TEXT,
  submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS status_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL REFERENCES applications(id),
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by INTEGER REFERENCES users(id),
  note TEXT,
  email_sent INTEGER NOT NULL DEFAULT 0,
  changed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Sample jobs
INSERT INTO jobs (title, department, location, employment_type, description, is_open) VALUES
  ('ผู้จัดการโครงการ','ปฏิบัติการ','นครราชสีมา','full_time','ดูแลและบริหารงานนิติบุคคลอาคารชุดและหมู่บ้านจัดสรร',1),
  ('เจ้าหน้าที่นิติบุคคล','ปฏิบัติการ','นครราชสีมา','full_time','ให้บริการลูกบ้าน จัดการเอกสาร รับเรื่องร้องเรียน',1),
  ('เจ้าหน้าที่บัญชี','บัญชีและการเงิน','นครราชสีมา','full_time','จัดทำบัญชีรายรับ-รายจ่าย ตรวจสอบเอกสารทางการเงิน',1),
  ('ช่างซ่อมบำรุง','วิศวกรรม','นครราชสีมา','full_time','ดูแลระบบไฟฟ้า ระบบประปา ระบบวิศวกรรมอาคาร',1);
