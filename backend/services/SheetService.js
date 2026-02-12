const { GoogleSpreadsheet } = require('google-spreadsheet');
const { v4: uuidv4 } = require('uuid');

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
        'schedule', 'mode', 'modeHi', 'fee', 'feeHi', 'image',
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

const initSheet = async () => {
    if (isInitialized) return doc;
    try {
        if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
            console.warn('⚠️ Google Service Account credentials missing in .env');
        } else {
            await doc.useServiceAccountAuth({
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            });
        }

        await doc.loadInfo();
        console.log(`✅ Loaded Google Sheet: ${doc.title}`);
        isInitialized = true;
        await ensureSheets();
        return doc;
    } catch (error) {
        console.error('❌ Failed to load Google Sheet:', error.message);
        throw error;
    }
};

// Columns to hide from the sheet view
const HIDDEN_COLUMNS = ['_id', 'createdAt', 'updatedAt'];

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
        console.log(`Creating sheet: ${title}`);
        sheet = await doc.addSheet({ title, headerValues });
    } else {
        // Ensure headers exist on existing sheets
        try {
            await sheet.loadHeaderRow();
        } catch (e) {
            // No headers found, set them
            console.log(`Setting headers for existing sheet: ${title}`);
            await sheet.setHeaderRow(headerValues);
        }
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

            HIDDEN_COLUMNS.forEach(col => {
                const colIndex = headers.indexOf(col);
                if (colIndex === -1) return;
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
            await doc._makeBatchUpdateRequest(requests);
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

    const newData = { _id: uuidv4(), ...data };
    const preparedData = prepareDataForSave(newData);

    const row = await sheet.addRow(preparedData);

    return formatRowData(row, headers);
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

    const preparedData = prepareDataForSave(data);

    Object.keys(preparedData).forEach(key => {
        if (key !== '_id') {
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
