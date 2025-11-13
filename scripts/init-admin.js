#!/usr/bin/env node

/**
 * Helper script to initialize the admin user
 * Run with: npm run init-admin
 */

const http = require('http');

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

console.log('🔧 Initializing admin user...');
console.log(`📍 Using base URL: ${BASE_URL}`);

const options = {
  hostname: new URL(BASE_URL).hostname,
  port: new URL(BASE_URL).port || 3000,
  path: '/api/auth/init',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (res.statusCode === 200) {
        console.log('✅ Admin user created successfully!');
        console.log(`📧 Email: ${response.email}`);
        console.log('\n🎉 You can now log in at /admin/login');
      } else {
        console.error('❌ Error:', response.error || 'Unknown error');
        if (response.error?.includes('already exists')) {
          console.log('ℹ️  Admin user already exists. You can log in at /admin/login');
        }
      }
    } catch (error) {
      console.error('❌ Failed to parse response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  console.log('\n💡 Make sure the development server is running (npm run dev)');
});

req.end();

