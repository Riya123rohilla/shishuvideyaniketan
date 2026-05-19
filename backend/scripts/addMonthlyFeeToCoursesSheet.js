const path = require('path');
const { GoogleSpreadsheet } = require('google-spreadsheet');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1OFLtKrBDqGI2QgU6R9xJkUvEdFlvTQYhrgVUS_WuAZk';
const SHEET_TITLE = 'Courses';

const MONTHLY_BY_YEARLY_NUMERIC = {
  '13100': '900/-',
  '14550': '1000/-',
  '16200': '1100/-',
  '21400': '1400/-',
  '22600': '1500/-',
  '24000': '—',
};

const toDigits = (value) => String(value || '').replace(/[^\d]/g, '');

async function authenticateDoc(doc) {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('Google Service Account credentials missing in .env');
  }

  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  privateKey = privateKey.replace(/\\n/g, '\n');

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: privateKey,
  });
}

async function ensureMonthlyFeeHeader(sheet) {
  await sheet.loadHeaderRow();
  const headers = [...sheet.headerValues];

  if (headers.includes('monthlyFee')) {
    return false;
  }

  headers.push('monthlyFee');

  const currentColumnCount = sheet.columnCount || sheet.gridProperties?.columnCount || headers.length;
  if (currentColumnCount < headers.length) {
    await sheet.resize({
      rowCount: sheet.rowCount,
      columnCount: headers.length,
    });
  }

  await sheet.setHeaderRow(headers);
  return true;
}

async function syncMonthlyFees(sheet) {
  const rows = await sheet.getRows();
  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    const yearlySource = row.feeHi || row.fee || '';
    const numeric = toDigits(yearlySource);
    const mappedMonthly = MONTHLY_BY_YEARLY_NUMERIC[numeric] || '';

    if (!mappedMonthly) {
      skipped += 1;
      continue;
    }

    const currentMonthly = String(row.monthlyFee || '').trim();
    if (currentMonthly === mappedMonthly) {
      skipped += 1;
      continue;
    }

    row.monthlyFee = mappedMonthly;
    await row.save();
    updated += 1;

    const id = row.code || row.id || row._id || 'unknown';
    console.log(`Updated ${id}: monthlyFee='${mappedMonthly}' from yearly='${yearlySource}'`);
  }

  return { updated, skipped };
}

async function main() {
  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await authenticateDoc(doc);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle[SHEET_TITLE];
    if (!sheet) {
      throw new Error(`Sheet '${SHEET_TITLE}' not found`);
    }

    const headerAdded = await ensureMonthlyFeeHeader(sheet);
    if (headerAdded) {
      console.log("Added 'monthlyFee' column to Courses sheet.");
    } else {
      console.log("'monthlyFee' column already exists.");
    }

    const { updated, skipped } = await syncMonthlyFees(sheet);
    console.log(`Done. Updated ${updated} rows, skipped ${skipped}.`);
  } catch (error) {
    console.error('Failed to add/sync monthly fee column:', error.message);
    process.exit(1);
  }
}

main();
