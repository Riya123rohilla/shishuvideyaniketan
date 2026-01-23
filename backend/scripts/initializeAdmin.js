#!/usr/bin/env node

const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK with Realtime Database credentials
const firebaseConfig = {
  apiKey: "AIzaSyBp4EGFLyzZPAzAM45DopE-1TCZfo_yihg",
  authDomain: "redesign-bbbbf.firebaseapp.com",
  databaseURL: "https://redesign-bbbbf-default-rtdb.firebaseio.com",
  projectId: "redesign-bbbbf",
  storageBucket: "redesign-bbbbf.firebasestorage.app",
  messagingSenderId: "261211649144",
  appId: "1:261211649144:web:fe58bb533bf2cd7c48e98d",
  measurementId: "G-QECYZD4QBG"
};

try {
  // Try to initialize with default credentials first (for production)
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: firebaseConfig.projectId,
      });
      console.log('✅ Firebase initialized with application default credentials');
    } catch (error) {
      // Fallback to database URL initialization for development
      admin.initializeApp({
        databaseURL: firebaseConfig.databaseURL,
      });
      console.log('✅ Firebase initialized with database URL');
    }
  }
} catch (error) {
  console.log('Firebase initialization status:', error.message);
}

const db = admin.firestore();

async function initializeAdmin() {
  try {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    console.log(`\n🔐 Setting up admin user...`);
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);

    const adminRef = db.collection('admins').doc('admin');
    
    await adminRef.set({
      username: username,
      password: password,
      createdAt: new Date(),
      updatedAt: new Date()
    }, { merge: true });

    console.log('\n✅ Admin user created/updated successfully in Firestore!');
    console.log('\n📝 You can now login with:');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log('\n🌐 Go to: http://localhost:3000/admin/login\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing admin:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeAdmin();
