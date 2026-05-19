const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const SheetService = require('../services/SheetService');

const YEARLY_BY_CLASS = {
  '01': '13,100/-',
  '02': '14,550/-',
  '03': '16,200/-',
  '04': '16,200/-',
  '05': '16,200/-',
  '06': '21,400/-',
  '07': '21,400/-',
  '08': '21,400/-',
  '09': '21,400/-',
  '10': '21,400/-',
  '11': '22,600/-',
  '12': '24,000/-',
};

const MONTHLY_BY_CLASS = {
  '01': '900/-',
  '02': '1000/-',
  '03': '1100/-',
  '04': '1100/-',
  '05': '1100/-',
  '06': '1400/-',
  '07': '1400/-',
  '08': '1400/-',
  '09': '1400/-',
  '10': '1400/-',
  '11': '1500/-',
  '12': '—',
};

const classFromCode = (code) => {
  const match = String(code || '').match(/^CLS-(\d{2})/);
  return match ? match[1] : null;
};

async function main() {
  try {
    const rows = await SheetService.getAll('Courses');
    let updated = 0;
    let skipped = 0;

    for (const row of rows) {
      const cls = classFromCode(row.code);
      if (!cls || !YEARLY_BY_CLASS[cls]) {
        skipped += 1;
        continue;
      }

      const fee = YEARLY_BY_CLASS[cls];
      const monthlyFee = MONTHLY_BY_CLASS[cls] || '';

      await SheetService.update('Courses', row._id, {
        fee,
        feeHi: fee,
        monthlyFee,
      });

      updated += 1;
      console.log(`Updated ${row.code}: fee=${fee}, monthlyFee=${monthlyFee}`);
    }

    const verify = await SheetService.getAll('Courses');
    console.log(`Done. Updated=${updated}, Skipped=${skipped}, Total=${verify.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to apply canonical fees:', error);
    process.exit(1);
  }
}

main();
