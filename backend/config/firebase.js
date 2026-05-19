const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Firebase Admin SDK
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// For Firebase Admin SDK, we need to use service account
// If you have a service account JSON file, use:
// const serviceAccount = require('./path/to/serviceAccountKey.json');
// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// Initialize Firebase Admin SDK
try {
  if (!admin.apps.length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY 
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0YOUR_TEMP_KEY\n-----END PRIVATE KEY-----\n';
    
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || 
      `firebase-adminsdk-temp@${firebaseConfig.projectId}.iam.gserviceaccount.com`;

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: firebaseConfig.projectId,
        clientEmail: clientEmail,
        privateKey: privateKey
      }),
      databaseURL: firebaseConfig.databaseURL
    });
    console.log('✅ Firebase initialized successfully');
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
  // Initialize without credentials for basic operations
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: firebaseConfig.projectId,
      databaseURL: firebaseConfig.databaseURL
    });
    console.log('⚠️  Firebase initialized in limited mode');
  }
}

// Get Firestore instance
const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };
