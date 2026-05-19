#!/usr/bin/env node

const https = require('https');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;
const databaseUrl = process.env.FIREBASE_DATABASE_URL;

if (!username || !password) {
  console.error('❌ ADMIN_USERNAME or ADMIN_PASSWORD is missing in environment.');
  process.exit(1);
}

if (!databaseUrl) {
  console.error('❌ FIREBASE_DATABASE_URL is missing in environment.');
  process.exit(1);
}

let databaseHost;
try {
  databaseHost = new URL(databaseUrl).hostname;
} catch (error) {
  console.error('❌ FIREBASE_DATABASE_URL is invalid.');
  process.exit(1);
}

async function initializeAdmin() {
  try {
    console.log(`\n🔐 Setting up admin user in Firebase Realtime Database...`);
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);

    const data = JSON.stringify({
      username: username,
      password: password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const options = {
      hostname: databaseHost,
      path: '/admins/admin.json',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log('\n✅ Admin user created/updated successfully in Firebase!');
            console.log('\n📝 You can now login with:');
            console.log(`   Username: ${username}`);
            console.log(`   Password: ${password}`);
            console.log('\n🌐 Go to: http://localhost:3000/admin/login\n');
            resolve();
          } else {
            reject(new Error(`Status code: ${res.statusCode}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(data);
      req.end();
    });
  } catch (error) {
    console.error('❌ Error initializing admin:', error.message);
    process.exit(1);
  }
}

// Run the initialization
initializeAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
