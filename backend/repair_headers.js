/**
 * Script to repair corrupted Google Sheet headers
 * Run this once to fix headers before using the enquiry system
 */

const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1OFLtKrBDqGI2QgU6R9xJkUvEdFlvTQYhrgVUS_WuAZk';

const SHEET_HEADERS = {
    Events: ['_id', 'title', 'description', 'startDate', 'endDate', 'image', 'isActive', 'priority', 'createdAt', 'updatedAt'],
    Enquiries: ['_id', 'name', 'email', 'phone', 'subject', 'message', 'status', 'notes', 'createdAt', 'updatedAt'],
    Admins: ['_id', 'username', 'email', 'password', 'createdAt', 'updatedAt'],
    Courses: [
        '_id', 'id', 'code', 'title', 'titleHi', 'summary', 'summaryHi',
        'ageRange', 'ageRangeHi', 'grade', 'gradeHi', 'duration', 'durationHi',
        'schedule', 'mode', 'modeHi', 'fee', 'feeHi', 'image',
        'category', 'categoryHi', 'popular', 'stream', 'prerequisites',
        'syllabus', 'teachers', 'faqs', 'subjects',
        'createdAt', 'updatedAt'
    ],
    Gallery: ['_id', 'title', 'category', 'description', 'src', 'createdAt', 'updatedAt'],
    Staff: [
        '_id', 'name', 'position', 'image', 'bio', 'qualifications',
        'experience', 'email', 'phone', 'achievements',
        'createdAt', 'updatedAt'
    ]
};

// Sheets that need repair
const SHEETS_TO_FIX = ['Events'];

// Helper to get column letter
const getColumnLetter = (index) => {
    let letter = '';
    while (index >= 0) {
        letter = String.fromCharCode((index % 26) + 65) + letter;
        index = Math.floor(index / 26) - 1;
    }
    return letter;
};

async function repairHeaders() {
    console.log('🔧 Starting Header Repair Script (Direct Cell Method)...\n');

    const doc = new GoogleSpreadsheet(SHEET_ID);

    try {
        let privateKey = process.env.GOOGLE_PRIVATE_KEY;
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            privateKey = privateKey.substring(1, privateKey.length - 1);
        }
        privateKey = privateKey.replace(/\\n/g, '\n');

        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: privateKey,
        });

        await doc.loadInfo();
        console.log(`✅ Connected to: ${doc.title}\n`);

        for (const sheetTitle of SHEETS_TO_FIX) {
            const headers = SHEET_HEADERS[sheetTitle];
            console.log(`\n📋 Processing sheet: ${sheetTitle}`);
            
            let sheet = doc.sheetsByTitle[sheetTitle];
            if (!sheet) {
                console.log(`  ⚠️ Sheet "${sheetTitle}" does not exist, skipping...`);
                continue;
            }

            try {
                const lastCol = getColumnLetter(headers.length - 1);
                const numRows = Math.min(sheet.rowCount, 100); // Check first 100 rows
                
                // Load all cells directly (bypassing getRows which uses corrupted headers)
                console.log(`  📥 Loading cells directly (A1:${lastCol}${numRows})...`);
                await sheet.loadCells(`A1:${lastCol}${numRows}`);

                // Read all data from cells (including row 1 which has data, not headers)
                const allData = [];
                for (let rowIdx = 0; rowIdx < numRows; rowIdx++) {
                    const rowData = {};
                    let hasAnyData = false;
                    
                    for (let colIdx = 0; colIdx < headers.length; colIdx++) {
                        const cell = sheet.getCell(rowIdx, colIdx);
                        let val = cell.value;
                        
                        // Only save valid values
                        if (val !== null && val !== undefined && val !== '') {
                            // Convert to string if not already a valid type
                            if (typeof val !== 'string' && typeof val !== 'number' && typeof val !== 'boolean') {
                                val = String(val);
                            }
                            rowData[headers[colIdx]] = val;
                            hasAnyData = true;
                        }
                    }

                    // Skip rows that are just headers
                    const firstCellVal = rowData[headers[0]];
                    const isHeaderRow = firstCellVal === headers[0] || firstCellVal === '_id';
                    
                    if (hasAnyData && !isHeaderRow) {
                        allData.push(rowData);
                    }
                }
                
                console.log(`  📊 Found ${allData.length} data rows to preserve`);

                // Delete the corrupted sheet
                console.log(`  🗑️ Deleting corrupted sheet...`);
                await sheet.delete();

                // Wait for deletion to propagate
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Re-fetch doc info
                await doc.loadInfo();

                // Create a new sheet with correct headers
                console.log(`  🆕 Creating new sheet with correct headers...`);
                const newSheet = await doc.addSheet({
                    title: sheetTitle,
                    headerValues: headers,
                    gridProperties: {
                        rowCount: Math.max(allData.length + 20, 100),
                        columnCount: Math.max(headers.length + 5, 20),
                        frozenRowCount: 1
                    }
                });

                // Wait for creation
                await new Promise(resolve => setTimeout(resolve, 500));

                // Restore the backed up data
                if (allData.length > 0) {
                    console.log(`  📤 Restoring ${allData.length} data rows...`);
                    for (let i = 0; i < allData.length; i++) {
                        try {
                            await newSheet.addRow(allData[i]);
                            if ((i + 1) % 10 === 0) {
                                console.log(`    Restored ${i + 1}/${allData.length} rows...`);
                            }
                        } catch (err) {
                            console.log(`    ⚠️ Row ${i + 1} failed: ${err.message}`);
                        }
                    }
                }

                console.log(`  ✅ Sheet "${sheetTitle}" repaired successfully!`);

            } catch (error) {
                console.log(`  ❌ Error processing ${sheetTitle}: ${error.message}`);
                console.log(`     ${error.stack}`);
            }
        }

        console.log('\n\n🎉 Header repair complete!');

    } catch (error) {
        console.error('❌ Failed to repair headers:', error.message);
    }
}

repairHeaders();
