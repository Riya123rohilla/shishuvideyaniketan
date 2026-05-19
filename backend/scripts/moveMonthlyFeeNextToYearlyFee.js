const path = require('path');
const { GoogleSpreadsheet } = require('google-spreadsheet');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1OFLtKrBDqGI2QgU6R9xJkUvEdFlvTQYhrgVUS_WuAZk';
const SHEET_TITLE = 'Courses';

async function auth(doc) {
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

async function reorderByRewrite(sheet, currentHeaders, desiredHeaders) {
  const rows = await sheet.getRows();
  const snapshots = rows.map((row) => {
    const snapshot = {};
    currentHeaders.forEach((header) => {
      snapshot[header] = row[header] ?? '';
    });
    return snapshot;
  });

  // Delete existing data rows from bottom to top.
  for (let i = rows.length - 1; i >= 0; i -= 1) {
    await rows[i].delete();
  }

  await sheet.setHeaderRow(desiredHeaders);

  for (const snapshot of snapshots) {
    const newRow = {};
    desiredHeaders.forEach((header) => {
      newRow[header] = snapshot[header] ?? '';
    });
    await sheet.addRow(newRow, { insert: false });
  }
}

async function main() {
  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await auth(doc);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle[SHEET_TITLE];
    if (!sheet) {
      throw new Error(`Sheet '${SHEET_TITLE}' not found`);
    }

    await sheet.loadHeaderRow();
    const headers = sheet.headerValues || [];

    const monthlyIndex = headers.indexOf('monthlyFee');
    const yearlyIndex = headers.indexOf('feeHi');

    if (monthlyIndex === -1) {
      throw new Error("'monthlyFee' column not found. Run addMonthlyFeeToCoursesSheet.js first.");
    }

    if (yearlyIndex === -1) {
      throw new Error("'feeHi' (yearly fee) column not found.");
    }

    const targetIndex = yearlyIndex + 1;

    if (monthlyIndex === targetIndex) {
      console.log('monthlyFee column is already next to yearly fee column (feeHi).');
      process.exit(0);
    }

    const desiredHeaders = [...headers];
    desiredHeaders.splice(monthlyIndex, 1);
    const adjustedTargetIndex = monthlyIndex < targetIndex ? targetIndex - 1 : targetIndex;
    desiredHeaders.splice(adjustedTargetIndex, 0, 'monthlyFee');

    await reorderByRewrite(sheet, headers, desiredHeaders);

    console.log(`Moved monthlyFee column from index ${monthlyIndex} to ${targetIndex} (right next to feeHi).`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to move monthlyFee column:', error.message);
    process.exit(1);
  }
}

main();
