#!/usr/bin/env node

const https = require('https');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const username = process.env.ADMIN_USERNAME || 'admin';
const password = process.env.ADMIN_PASSWORD || 'admin123';

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
      hostname: 'redesign-bbbbf-default-rtdb.firebaseio.com',
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
