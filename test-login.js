const fetch = require('node-fetch');

async function testLogin() {
  const API_URL = 'http://localhost:4000/api/v1';
  
  console.log('Testing login scenarios...\n');
  
  // Test 1: Login without tenant (should work)
  try {
    console.log('1. Testing login without tenantId...');
    const response1 = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@acme.com',
        password: 'Password123!'
      })
    });
    
    const result1 = await response1.json();
    console.log('✅ Success:', response1.status, result1);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  // Test 2: Login with tenant slug
  try {
    console.log('\n2. Testing login with tenant slug...');
    const response2 = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantId: 'acme-corp',
        email: 'admin@acme.com',
        password: 'Password123!'
      })
    });
    
    const result2 = await response2.json();
    console.log('✅ Success:', response2.status, result2);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  // Test 3: Login with wrong tenant
  try {
    console.log('\n3. Testing login with wrong tenant...');
    const response3 = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantId: 'wrong-tenant',
        email: 'admin@acme.com',
        password: 'Password123!'
      })
    });
    
    const result3 = await response3.json();
    console.log('Response:', response3.status, result3);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testLogin().catch(console.error);