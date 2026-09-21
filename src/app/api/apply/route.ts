export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDB, getR2 } from '@/lib/db';


async function uploadToR2(r2: R2Bucket, file: File, folder: string): Promise<{ key: string; originalName: string; mimeType: string; size: number }> {
  const ext = file.name.split('.').pop() || 'bin';
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  await r2.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
  return { key, originalName: file.name, mimeType: file.type, size: file.size };
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const db = getDB();
    const r2 = getR2();

    const jobId = parseInt(form.get('job_id') as string || '0');
    const job = await db.prepare('SELECT id FROM jobs WHERE id = ? AND is_open = 1').bind(jobId).first();
    if (!job) return NextResponse.json({ ok: false, error: 'ตำแหน่งงานนี้ปิดรับสมัครแล้ว' }, { status: 422 });

    const firstName = (form.get('first_name') as string || '').trim();
    const lastName = (form.get('last_name') as string || '').trim();
    const email = (form.get('email') as string || '').trim();
    const phone = (form.get('phone') as string || '').trim();
    const eduLevel = (form.get('edu_level') as string || '').trim();
    const eduInstitution = (form.get('edu_institution') as string || '').trim();

    if (!firstName || !lastName || !email || !phone || !eduLevel || !eduInstitution) {
      return NextResponse.json({ ok: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 422 });
    }

    const resumeFile = form.get('resume_file') as File | null;
    if (!resumeFile || resumeFile.size === 0) {
      return NextResponse.json({ ok: false, error: 'Resume/CV is required.' }, { status: 422 });
    }

    // Insert applicant
    const applicantResult = await db.prepare(`
      INSERT INTO applicants (first_name, last_name, email, phone, national_id, id_issued_by, id_issued_province,
        date_of_birth, age, weight_height, ethnicity, nationality, religion,
        address, address_current, military_status, father_name, mother_name,
        parent_occupation, parent_contact_phone, marital_status,
        emergency_contact_info, emergency_contact_phone, expected_salary)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).bind(
      firstName, lastName, email, phone,
      form.get('national_id') || null, form.get('id_issued_by') || null, form.get('id_issued_province') || null,
      form.get('date_of_birth') || null,
      form.get('age') ? parseInt(form.get('age') as string) : null,
      form.get('weight_height') || null, form.get('ethnicity') || null,
      form.get('nationality') || null, form.get('religion') || null,
      form.get('address') || null, form.get('address_current') || null,
      form.get('military_status') || null, form.get('father_name') || null,
      form.get('mother_name') || null, form.get('parent_occupation') || null,
      form.get('parent_contact_phone') || null, form.get('marital_status') || null,
      form.get('emergency_contact_info') || null, form.get('emergency_contact_phone') || null,
      form.get('expected_salary') ? parseInt(form.get('expected_salary') as string) : null,
    ).run();

    const applicantId = applicantResult.meta.last_row_id;

    // Insert education
    await db.prepare('INSERT INTO education (applicant_id, level, institution, field_of_study, graduation_year) VALUES (?,?,?,?,?)').bind(
      applicantId, eduLevel, eduInstitution,
      form.get('edu_field') || null,
      form.get('edu_year') ? parseInt(form.get('edu_year') as string) : null,
    ).run();

    // Upload documents
    const docInsert = db.prepare('INSERT INTO documents (applicant_id, doc_type, original_filename, r2_key, mime_type, file_size) VALUES (?,?,?,?,?,?)');
    let photoDocId: number | null = null;

    // Camera photo
    const cameraData = form.get('camera_photo_data') as string | null;
    if (cameraData && cameraData.startsWith('data:image/')) {
      const base64 = cameraData.split(',')[1];
      const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      const key = `photos/${Date.now()}-camera.png`;
      await r2.put(key, binary, { httpMetadata: { contentType: 'image/png' } });
      const r = await docInsert.bind(applicantId, 'photo', 'camera_photo.png', key, 'image/png', binary.length).run();
      photoDocId = r.meta.last_row_id;
    }

    // Recent photo file
    const recentPhoto = form.get('recent_photo_file') as File | null;
    if (recentPhoto && recentPhoto.size > 0) {
      const meta = await uploadToR2(r2, recentPhoto, 'photos');
      await docInsert.bind(applicantId, 'recent_photo', meta.originalName, meta.key, meta.mimeType, meta.size).run();
    }

    // Resume
    const resumeMeta = await uploadToR2(r2, resumeFile, 'resumes');
    await docInsert.bind(applicantId, 'resume', resumeMeta.originalName, resumeMeta.key, resumeMeta.mimeType, resumeMeta.size).run();

    // ID card
    const idFile = form.get('id_file') as File | null;
    if (idFile && idFile.size > 0) {
      const meta = await uploadToR2(r2, idFile, 'photos');
      await docInsert.bind(applicantId, 'id_card', meta.originalName, meta.key, meta.mimeType, meta.size).run();
    }

    // Certificate
    const certFile = form.get('cert_file') as File | null;
    if (certFile && certFile.size > 0) {
      const meta = await uploadToR2(r2, certFile, 'resumes');
      await docInsert.bind(applicantId, 'transcript', meta.originalName, meta.key, meta.mimeType, meta.size).run();
    }

    // House registration
    const houseRegFile = form.get('house_reg_file') as File | null;
    if (houseRegFile && houseRegFile.size > 0) {
      const meta = await uploadToR2(r2, houseRegFile, 'photos');
      await docInsert.bind(applicantId, 'other', meta.originalName, meta.key, meta.mimeType, meta.size).run();
    }

    // Update photo_document_id
    if (photoDocId) {
      await db.prepare('UPDATE applicants SET photo_document_id = ? WHERE id = ?').bind(photoDocId, applicantId).run();
    }

    // Insert application
    const appResult = await db.prepare('INSERT INTO applications (applicant_id, job_id, status, cover_note) VALUES (?,?,?,?)').bind(
      applicantId, jobId, 'pending', form.get('cover_note') || null
    ).run();
    const applicationId = appResult.meta.last_row_id;

    await db.prepare("INSERT INTO status_history (application_id, old_status, new_status, note) VALUES (?,NULL,'pending','Application submitted')").bind(applicationId).run();

    return NextResponse.json({ ok: true, ref: applicationId });
  } catch (err) {
    console.error('[APPLY ERROR]', err);
    return NextResponse.json({ ok: false, error: 'เกิดข้อผิดพลาดภายในระบบ กรุณาลองใหม่' }, { status: 500 });
  }
}
