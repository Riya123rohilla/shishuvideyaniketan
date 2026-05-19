const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const SheetService = require('../services/SheetService');

const SHEET_TITLE = 'Courses';

async function main() {
  try {
    const courses = await SheetService.getAll(SHEET_TITLE);

    let updated = 0;
    let skipped = 0;

    for (const course of courses) {
      const currentFee = (course.fee || '').toString().trim();
      const realFee = (course.feeHi || '').toString().trim();

      // Only update when there is a real fee value and fee column differs.
      if (!realFee || currentFee === realFee) {
        skipped += 1;
        continue;
      }

      await SheetService.update(SHEET_TITLE, course._id, { fee: realFee });
      updated += 1;
      console.log(`Updated ${course.code || course.id || course._id}: fee '${currentFee}' -> '${realFee}'`);
    }

    console.log(`Done. Updated ${updated} course rows, skipped ${skipped}.`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to sync fee column from feeHi:', error);
    process.exit(1);
  }
}

main();
