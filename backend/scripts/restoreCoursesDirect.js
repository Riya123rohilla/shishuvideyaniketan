const fs = require('fs');
const path = require('path');
const { GoogleSpreadsheet } = require('google-spreadsheet');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1OFLtKrBDqGI2QgU6R9xJkUvEdFlvTQYhrgVUS_WuAZk';

const COURSES_HEADERS = [
  '_id', 'id', 'code', 'title', 'titleHi', 'summary', 'summaryHi',
  'ageRange', 'ageRangeHi', 'grade', 'gradeHi', 'duration', 'durationHi',
  'schedule', 'mode', 'modeHi', 'fee', 'feeHi', 'monthlyFee', 'image',
  'category', 'categoryHi', 'popular', 'stream', 'prerequisites',
  'syllabus', 'teachers', 'faqs', 'subjects',
  'createdAt', 'updatedAt'
];

const MONTHLY_BY_YEARLY_NUMERIC = {
  '13100': '900/-',
  '14550': '1000/-',
  '16200': '1100/-',
  '21400': '1400/-',
  '22600': '1500/-',
  '24000': '—',
};

const toDigits = (value) => String(value || '').replace(/[^\d]/g, '');

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const extractCoursesData = () => {
  const filePath = path.resolve(__dirname, '../seed_real_data.js');
  const source = fs.readFileSync(filePath, 'utf8');
  const match = source.match(/const\s+coursesData\s*=\s*(\[[\s\S]*?\])\s*;\s*\n\s*\/\/\s*Events Data/);

  if (!match || !match[1]) {
    throw new Error('Could not extract coursesData from seed_real_data.js');
  }

  // eslint-disable-next-line no-new-func
  return Function(`return (${match[1]});`)();
};

const toRow = (course) => {
  const now = new Date().toISOString();
  const yearlyFee = (course.feeHi || course.fee || '').replace('₹', '').replace('/वर्ष', '/-').trim();
  const monthlyFee = MONTHLY_BY_YEARLY_NUMERIC[toDigits(yearlyFee)] || '';

  const row = {
    _id: createId(),
    id: course.id || '',
    code: course.code || '',
    title: course.title || '',
    titleHi: course.titleHi || '',
    summary: course.summary || '',
    summaryHi: course.summaryHi || '',
    ageRange: course.ageRange || '',
    ageRangeHi: course.ageRangeHi || '',
    grade: course.grade || '',
    gradeHi: course.gradeHi || '',
    duration: course.duration || '',
    durationHi: course.durationHi || '',
    schedule: course.schedule || '',
    mode: course.mode || '',
    modeHi: course.modeHi || '',
    fee: yearlyFee || course.fee || '',
    feeHi: yearlyFee || course.feeHi || '',
    monthlyFee,
    image: course.image || '',
    category: course.category || '',
    categoryHi: course.categoryHi || '',
    popular: String(Boolean(course.popular)),
    stream: course.stream || '',
    prerequisites: course.prerequisites || '',
    syllabus: JSON.stringify(course.syllabus || []),
    teachers: JSON.stringify(course.teachers || []),
    faqs: JSON.stringify(course.faqs || []),
    subjects: JSON.stringify(course.subjects || []),
    createdAt: now,
    updatedAt: now,
  };

  return row;
};

async function authDoc(doc) {
  let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  privateKey = privateKey.replace(/\\n/g, '\n');

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: privateKey,
  });
}

async function main() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY in backend/.env');
  }

  const doc = new GoogleSpreadsheet(SHEET_ID);
  await authDoc(doc);
  await doc.loadInfo();

  const coursesData = extractCoursesData();
  const rowsToInsert = coursesData.map(toRow);

  let sheet = doc.sheetsByTitle.Courses;
  if (!sheet) {
    sheet = await doc.addSheet({
      title: 'Courses',
      headerValues: COURSES_HEADERS,
      gridProperties: { rowCount: 200, columnCount: Math.max(COURSES_HEADERS.length + 5, 40) },
    });
  } else {
    await sheet.setHeaderRow(COURSES_HEADERS);
    const existingRows = await sheet.getRows();
    for (const row of existingRows) {
      await row.delete();
    }
  }

  await sheet.addRows(rowsToInsert);

  const finalRows = await sheet.getRows();
  console.log(`Restored courses: ${rowsToInsert.length}`);
  console.log(`Rows currently in Courses sheet: ${finalRows.length}`);
  console.log('Sample codes:', finalRows.slice(0, 5).map((r) => r.code).join(', '));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Restore failed:', err.message);
    process.exit(1);
  });
