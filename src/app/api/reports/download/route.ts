import { NextRequest, NextResponse } from 'next/server';
import { getAuthTeacher } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(_request: NextRequest) {
  const teacher = await getAuthTeacher();
  if (!teacher) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const sapanaDocx = path.join(process.cwd(), 'db', 'sapana', 'STUDENTS_INTERESTS_REPORT.docx');
  const gaganDocx = path.join(process.cwd(), 'db', 'gagan-sir-stduents', 'STUDENTS_INTERESTS_REPORT.docx');

  let targetPath = '';
  let filename = 'Students_Interests_Report.docx';

  if (teacher.email.toLowerCase().includes('sapana')) {
    targetPath = sapanaDocx;
    filename = 'Sapana_Soni_Students_Interests_Report.docx';
  } else if (teacher.email.toLowerCase().includes('gagan')) {
    targetPath = gaganDocx;
    filename = 'Gagan_Students_Interests_Report.docx';
  } else if (fs.existsSync(sapanaDocx)) {
    targetPath = sapanaDocx;
  } else if (fs.existsSync(gaganDocx)) {
    targetPath = gaganDocx;
  }

  if (!targetPath || !fs.existsSync(targetPath)) {
    return NextResponse.json(
      { error: 'Pre-generated Word document not found. Please use the Print / Export PDF feature in the website.' },
      { status: 404 }
    );
  }

  try {
    const fileBuffer = fs.readFileSync(targetPath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error serving report docx:', error);
    return NextResponse.json({ error: 'Failed to download report' }, { status: 500 });
  }
}
