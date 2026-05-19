const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

let uuidv4;

// Dynamic import for uuid (ESM module)
const loadUuid = async () => {
    if (!uuidv4) {
        const uuidModule = await import('uuid');
        uuidv4 = uuidModule.v4;
    }
    return uuidv4;
};

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1OFLtKrBDqGI2QgU6R9xJkUvEdFlvTQYhrgVUS_WuAZk';

const doc = new GoogleSpreadsheet(SHEET_ID);

let isInitialized = false;

// Define headers for each sheet
const SHEET_HEADERS = {
    Events: ['_id', 'title', 'description', 'startDate', 'endDate', 'image', 'isActive', 'priority', 'createdAt', 'updatedAt'],
    Enquiries: ['_id', 'name', 'email', 'phone', 'subject', 'message', 'status', 'notes', 'createdAt', 'updatedAt'],
    Admins: ['_id', 'username', 'email', 'password', 'createdAt', 'updatedAt'],
    Courses: [
        '_id', 'id', 'code', 'title', 'titleHi', 'summary', 'summaryHi',
        'ageRange', 'ageRangeHi', 'grade', 'gradeHi', 'duration', 'durationHi',
        'schedule', 'mode', 'modeHi', 'fee', 'feeHi', 'monthlyFee', 'image',
        'category', 'categoryHi', 'popular', 'stream', 'prerequisites',
        'syllabus', 'teachers', 'faqs', 'subjects', // JSON fields
        'createdAt', 'updatedAt'
    ],
    Gallery: ['_id', 'title', 'category', 'description', 'src', 'createdAt', 'updatedAt'],
    Staff: [
        '_id', 'name', 'position', 'image', 'bio', 'qualifications',
        'experience', 'email', 'phone', 'achievements', // achievements is JSON
        'createdAt', 'updatedAt'
    ]
};

// Fields that should be treated as JSON
const JSON_FIELDS = ['syllabus', 'teachers', 'faqs', 'subjects', 'achievements'];

let initializationPromise = null;

const initSheet = async () => {
    if (initializationPromise) return initializationPromise;

    initializationPromise = (async () => {
        try {
            if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
                console.warn('⚠️ Google Service Account credentials missing in .env');
            } else {
                let privateKey = process.env.GOOGLE_PRIVATE_KEY;
                if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
                    privateKey = privateKey.substring(1, privateKey.length - 1);
                }
                privateKey = privateKey.replace(/\\n/g, '\n');

                await doc.useServiceAccountAuth({
                    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    private_key: privateKey,
                });
            }

            await doc.loadInfo();
            console.log(`✅ Loaded Google Sheet: ${doc.title}`);
            await ensureSheets();
            isInitialized = true;
            return doc;
        } catch (error) {
            console.error('❌ Failed to load Google Sheet:', error.message);
            initializationPromise = null; // Reset so we can try again
            throw error;
        }
    })();

    return initializationPromise;
};

// Columns to hide from the sheet view
const HIDDEN_COLUMNS = ['_id', 'createdAt', 'updatedAt'];

const getColumnLetter = (index) => {
    let letter = '';
    while (index >= 0) {
        letter = String.fromCharCode((index % 26) + 65) + letter;
        index = Math.floor(index / 26) - 1;
    }
    return letter;
};

const ensureSheets = async () => {
    for (const [title, headers] of Object.entries(SHEET_HEADERS)) {
        await ensureSheetExistance(title, headers);
    }
    // Hide metadata columns after all sheets are ready
    await hideMetadataColumns();
};

const ensureSheetExistance = async (title, headerValues) => {
    let sheet = doc.sheetsByTitle[title];

    if (!sheet) {
        console.log(`🆕 Creating sheet: ${title}`);
        sheet = await doc.addSheet({
            title,
            headerValues,
            gridProperties: {
                rowCount: 100,
                columnCount: Math.max(headerValues.length + 5, 20),
                frozenRowCount: 1
            }
        });
        return sheet;
    }

    try {
        const rowCount = sheet.rowCount;
        if (rowCount < 2) {
            console.log(`📏 [${title}] Resizing small sheet...`);
            await sheet.resize({ rowCount: 100, columnCount: Math.max(headerValues.length + 5, 20) });
        }

        // Load the full header row span based on configured columns
        const lastHeaderColumn = getColumnLetter(headerValues.length - 1);
        await sheet.loadCells(`A1:${lastHeaderColumn}1`);

        let needsUpdate = false;
        let hasDataInHeader = false;

        // Check each header cell
        for (let i = 0; i < headerValues.length; i++) {
            const cell = sheet.getCell(0, i);
            const val = cell.value || '';

            // Log for debugging
            if (i === 0) console.log(`🔍 [${title}] Row 1, Col 0: "${val}" (Expected: "${headerValues[0]}")`);

            // Check if this cell contains data instead of a header
            const isData = val && (
                val.includes('@') ||
                (val.includes('-') && val.length > 30) || // UUID check
                /^\d{10,}$/.test(val) || // Direct phone/ID check
                /^\d{4}-\d{2}-\d{2}T/.test(val) || // ISO Date check
                val.length > 100 // Long message body
            );

            if (val !== headerValues[i] || isData) {
                needsUpdate = true;
                hasDataInHeader = hasDataInHeader || isData;
                cell.value = headerValues[i];
                cell.textFormat = { bold: true };
                cell.backgroundColor = { red: 0.9, green: 0.9, blue: 0.9 };
            }
        }

        if (needsUpdate) {
            if (hasDataInHeader) {
                console.log(`🚨 [${title}] CRITICAL: Found data in header row! Fixing headers and preserving data...`);
                
                // If there's data in the header row, we need to move it down first
                // Load more cells to handle data preservation
                await sheet.loadCells(`A1:${lastHeaderColumn}10`);
                
                // Find the first empty row to move header data to
                let targetRow = 1;
                let foundEmptyRow = false;
                for (let rowIndex = 1; rowIndex < 10; rowIndex++) {
                    let isEmpty = true;
                    for (let colIndex = 0; colIndex < headerValues.length; colIndex++) {
                        const cell = sheet.getCell(rowIndex, colIndex);
                        if (cell && cell.value !== null && cell.value !== undefined && cell.value !== '') {
                            isEmpty = false;
                            break;
                        }
                    }
                    if (isEmpty) {
                        targetRow = rowIndex;
                        foundEmptyRow = true;
                        break;
                    }
                }
                
                if (foundEmptyRow) {
                    // Move corrupted header data to the empty row
                    for (let i = 0; i < headerValues.length; i++) {
                        const headerCell = sheet.getCell(0, i);
                        const val = headerCell.value || '';
                        
                    // Only move if it looks like data
                        const isData = val && val.toString && (
                            val.toString().includes('@') ||
                            (val.toString().includes('-') && val.toString().length > 30) ||
                            /^\d{10,}$/.test(val.toString()) ||
                            /^\d{4}-\d{2}-\d{2}T/.test(val.toString()) ||
                            val.toString().length > 100
                        );
                        
                        if (isData) {
                            const targetCell = sheet.getCell(targetRow, i);
                            targetCell.value = val;
                            console.log(`📋 [${title}] Moved data "${val}" from header to row ${targetRow + 1}`);
                        }
                    }
                }
            }
            
            // Set correct headers
            for (let i = 0; i < headerValues.length; i++) {
                const cell = sheet.getCell(0, i);
                cell.value = headerValues[i];
                cell.textFormat = { bold: true };
                cell.backgroundColor = { red: 0.9, green: 0.9, blue: 0.9 };
            }

            console.log(`📋 [${title}] Fixing headers...`);
            await sheet.saveCells();

            // Verify the fix
            await sheet.loadCells('A1:A1');
            console.log(`🧐 [${title}] Row 1, Col 0 is now: "${sheet.getCell(0, 0).value}"`);
        }

        // Load header row for the library
        await sheet.loadHeaderRow();
        
    } catch (e) {
        console.warn(`⚠️ [${title}] Header fix failed:`, e.message);
        // Fallback: manually set headers if loading fails
        sheet.headerValues = headerValues;
    }
    return sheet;
};

// Hide _id, createdAt, updatedAt columns in all sheets
const hideMetadataColumns = async () => {
    try {
        const requests = [];
        for (const [title, headers] of Object.entries(SHEET_HEADERS)) {
            const sheet = doc.sheetsByTitle[title];
            if (!sheet) continue;

            // Ensure sheet has enough columns loaded in its properties
            const colCount = sheet.gridProperties ? sheet.gridProperties.columnCount : 26;

            HIDDEN_COLUMNS.forEach(col => {
                const colIndex = headers.indexOf(col);
                if (colIndex === -1 || colIndex >= colCount) return;

                requests.push({
                    updateDimensionProperties: {
                        range: {
                            sheetId: sheet.sheetId,
                            dimension: 'COLUMNS',
                            startIndex: colIndex,
                            endIndex: colIndex + 1,
                        },
                        properties: { hiddenByUser: true },
                        fields: 'hiddenByUser',
                    },
                });
            });
        }

        if (requests.length > 0) {
            // doc._makeBatchUpdateRequest is internal and often breaks on certain versions
            // console.log('Hiding metadata columns via batch update...');
            // await doc._makeBatchUpdateRequest(requests);
        }
    } catch (error) {
        console.warn('Could not hide metadata columns:', error.message);
    }
};

// --- Helper Functions ---

const formatRowData = (row, headers) => {
    const obj = {};
    headers.forEach(header => {
        let value = row[header];
        if (JSON_FIELDS.includes(header) && value) {
            try {
                obj[header] = JSON.parse(value);
            } catch (e) {
                console.warn(`Failed to parse JSON for ${header}`, e.message);
                obj[header] = []; // Default to empty array on fail
            }
        } else {
            obj[header] = value;
        }
    });
    return obj;
};

const prepareDataForSave = (data) => {
    const prepared = { ...data };
    JSON_FIELDS.forEach(field => {
        if (prepared[field] !== undefined) {
            prepared[field] = JSON.stringify(prepared[field]);
        }
    });
    return prepared;
};

// --- CRUD Operations ---

const getAll = async (sheetTitle) => {
    await initSheet();
    const sheet = doc.sheetsByTitle[sheetTitle];
    const rows = await sheet.getRows();
    const headers = SHEET_HEADERS[sheetTitle];

    return rows.map(row => formatRowData(row, headers));
};

const add = async (sheetTitle, data) => {
    await initSheet();
    const sheet = doc.sheetsByTitle[sheetTitle];
    const headers = SHEET_HEADERS[sheetTitle];
    const uuid = await loadUuid();

    // Double-check: ensure the library knows the headers before we add a row
    if (!sheet.headerValues || sheet.headerValues.length === 0) {
        try {
            await sheet.loadHeaderRow();
        } catch (e) {
            console.warn(`⚠️ [${sheetTitle}] Could not load headers, setting manually...`);
            sheet.headerValues = headers;
        }
    }

    const now = new Date().toISOString();
    // Use a clean object to ensure we don't accidentally pass something that overrides our columns
    const newData = {};
    headers.forEach(h => {
        if (h === '_id') newData[h] = uuid();
        else if (h === 'createdAt') newData[h] = now;
        else if (h === 'updatedAt') newData[h] = now;
        else if (h === 'status') newData[h] = data.status || 'pending';
        else if (data[h] !== undefined) newData[h] = data[h];
        else newData[h] = ''; // Ensure every column has at least an empty string
    });

    const preparedData = prepareDataForSave(newData);
    console.log(`📤 Adding row to ${sheetTitle}:`, preparedData.name || preparedData.title || preparedData._id);

    try {
        // Get all existing rows to find the last data row
        const existingRows = await sheet.getRows();
        const targetRowIndex = existingRows.length + 1; // +1 because row 0 is headers
        
        console.log(`📍 [${sheetTitle}] Inserting data at row ${targetRowIndex + 1} (after ${existingRows.length} existing data rows)`);
        
        // Calculate column letter for the range
        const getColumnLetter = (index) => {
            let letter = '';
            while (index >= 0) {
                letter = String.fromCharCode((index % 26) + 65) + letter;
                index = Math.floor(index / 26) - 1;
            }
            return letter;
        };
        
        const lastColumn = getColumnLetter(headers.length - 1);
        
        // Ensure sheet has enough rows
        if (targetRowIndex >= sheet.rowCount) {
            console.log(`📏 [${sheetTitle}] Resizing sheet to accommodate new row...`);
            await sheet.resize({ rowCount: targetRowIndex + 10, columnCount: Math.max(headers.length + 5, 20) });
        }
        
        // Load cells for the target row
        const range = `A${targetRowIndex + 1}:${lastColumn}${targetRowIndex + 1}`;
        await sheet.loadCells(range);
        
        // Set values in the target row
        for (let colIndex = 0; colIndex < headers.length; colIndex++) {
            const header = headers[colIndex];
            const cell = sheet.getCell(targetRowIndex, colIndex);
            cell.value = preparedData[header] !== undefined ? preparedData[header] : '';
        }
        
        // Save the new row
        await sheet.saveCells();
        
        console.log(`✅ [${sheetTitle}] New row added at Row #${targetRowIndex + 1}`);

        // Create a mock row object to maintain compatibility with existing code
        const mockRow = {
            rowNumber: targetRowIndex + 1,
            rowIndex: targetRowIndex,
            ...newData
        };

        return formatRowData(mockRow, headers);
        
    } catch (error) {
        console.error(`❌ [${sheetTitle}] Add operation failed:`, error.message);
        
        // Last resort fallback: use addRow with insert:false to append at end
        console.log(`⚠️ [${sheetTitle}] Attempting fallback with addRow insert:false...`);
        
        try {
            // Force library to know headers
            sheet.headerValues = headers;
            
            const row = await sheet.addRow(preparedData, { insert: false });
            console.log(`✅ [${sheetTitle}] New row added at Row #${row.rowNumber} via fallback`);
            return formatRowData(row, headers);
        } catch (fallbackError) {
            console.error(`❌ [${sheetTitle}] Fallback also failed:`, fallbackError.message);
            throw fallbackError;
        }
    }
};

const getById = async (sheetTitle, id) => {
    await initSheet();
    const sheet = doc.sheetsByTitle[sheetTitle];
    const rows = await sheet.getRows();

    // Check both _id (internal) and id (custom, if exists)
    let row = rows.find(r => r._id === id);
    if (!row && SHEET_HEADERS[sheetTitle].includes('id')) {
        row = rows.find(r => r.id === id);
    }

    if (!row) return null;

    const headers = SHEET_HEADERS[sheetTitle];
    return formatRowData(row, headers);
};

const getByUsername = async (username) => {
    await initSheet();
    const sheet = doc.sheetsByTitle['Admins'];
    const rows = await sheet.getRows();
    // Check username OR email
    const row = rows.find(r => r.username === username || r.email === username);
    if (!row) return null;

    return formatRowData(row, SHEET_HEADERS['Admins']);
};

const update = async (sheetTitle, id, data) => {
    await initSheet();
    const sheet = doc.sheetsByTitle[sheetTitle];
    const rows = await sheet.getRows();
    const row = rows.find(r => r._id === id);
    if (!row) return null;

    const preparedData = prepareDataForSave({ ...data, updatedAt: new Date().toISOString() });

    Object.keys(preparedData).forEach(key => {
        if (key !== '_id' && key !== 'createdAt') {
            row[key] = preparedData[key];
        }
    });
    await row.save();

    const headers = SHEET_HEADERS[sheetTitle];
    return formatRowData(row, headers);
};

const remove = async (sheetTitle, id) => {
    await initSheet();
    const sheet = doc.sheetsByTitle[sheetTitle];
    const rows = await sheet.getRows();
    const row = rows.find(r => r._id === id);
    if (!row) return false;
    await row.delete();
    return true;
};

const deleteSheet = async (sheetTitle) => {
    await initSheet();
    const sheet = doc.sheetsByTitle[sheetTitle];
    if (sheet) {
        await sheet.delete();
        console.log(`🗑️ Deleted sheet: ${sheetTitle}`);
        // Reset initialization so ensureSheets runs again to recreate it with new headers
        isInitialized = false;
    }
};

module.exports = {
    getAll,
    add,
    getById,
    getByUsername,
    update,
    remove,
    deleteSheet,
    SHEET_ID
};
