// Test script to verify backend endpoints
// Run with: node test-backend.js

const API_URL = 'http://localhost:5000/api';

async function testEndpoint(method, endpoint, data = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();
    console.log(`✓ ${method} ${endpoint}:`, response.status, result);
    return { success: response.ok, data: result, status: response.status };
  } catch (error) {
    console.error(`✗ ${method} ${endpoint}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Testing StudyMate Pro Backend\n');
  console.log('Backend URL:', API_URL);
  console.log('─'.repeat(50));

  // Test 1: Server health
  console.log('\n1. Testing server health...');
  await testEndpoint('GET', '/');

  // Test 2: Sign up
  console.log('\n2. Testing user signup...');
  const signupResult = await testEndpoint('POST', '/auth/signup', {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123'
  });

  if (!signupResult.success) {
    console.error('❌ Signup failed. Cannot continue tests.');
    return;
  }

  const token = signupResult.data.token;
  console.log('✓ Token received:', token.substring(0, 20) + '...');

  // Test 3: Create subject
  console.log('\n3. Testing subject creation...');
  const subjectResult = await testEndpoint('POST', '/subjects', {
    name: 'Mathematics',
    credits: 3,
    targetGrade: 'A',
    examDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    priorityScore: 50
  }, token);

  if (!subjectResult.success) {
    console.error('❌ Subject creation failed');
    return;
  }

  const subjectId = subjectResult.data._id;
  console.log('✓ Subject created with ID:', subjectId);

  // Test 4: Get subjects
  console.log('\n4. Testing get subjects...');
  await testEndpoint('GET', '/subjects', null, token);

  // Test 5: Update subject
  console.log('\n5. Testing subject update...');
  await testEndpoint('PATCH', `/subjects/${subjectId}`, {
    priorityScore: 75
  }, token);

  // Test 6: Create academic profile
  console.log('\n6. Testing academic profile creation...');
  await testEndpoint('POST', '/academic/profile', {
    subjects: [{
      name: 'Mathematics',
      credits: 3,
      requiredGrade: 8.5,
      priorityScore: 75
    }],
    currentCGPA: 0,
    targetCGPA: 8.5,
    semesterExamDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    setupCompleted: true
  }, token);

  // Test 7: Complete setup
  console.log('\n7. Testing setup completion...');
  await testEndpoint('POST', '/setup/complete', {
    dailyStudyHours: 2.5
  }, token);

  // Test 8: Get stats
  console.log('\n8. Testing stats endpoint...');
  await testEndpoint('GET', '/stats', null, token);

  console.log('\n' + '─'.repeat(50));
  console.log('✅ All tests completed!');
  console.log('\nIf all tests passed, your backend is working correctly.');
  console.log('You can now proceed with the frontend setup wizard.');
}

// Run tests
runTests().catch(console.error);
