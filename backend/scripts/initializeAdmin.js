#!/usr/bin/env node

const dotenv = require('dotenv');
const { db } = require('../config/firebase');

// Load environment variables
dotenv.config();

if (!db) {
  console.error('❌ Firebase is not initialized. Check your environment configuration.');
  process.exit(1);
}

async function initializeAdmin() {
  try {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      console.error('❌ ADMIN_USERNAME or ADMIN_PASSWORD is missing in environment.');
      process.exit(1);
    }

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
