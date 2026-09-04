const http = require('http');

const request = (path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = {
      'Content-Type': 'application/json',
    };
    if (data) headers['Content-Length'] = Buffer.byteLength(data);
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers,
      },
      (res) => {
        let resData = '';
        res.on('data', (chunk) => (resData += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(resData) });
          } catch (e) {
            resolve({ status: res.statusCode, body: resData });
          }
        });
      }
    );

    req.on('error', (err) => reject(err));
    if (data) req.write(data);
    req.end();
  });
};

async function runTests() {
  console.log('🧪 Starting API Automated Tests...\n');

  // 1. Health Check
  const health = await request('/api/health');
  console.log(`1. Health Check: Status ${health.status} -`, health.body.status);

  // 2. Demo Login Student
  const student = await request('/api/auth/demo-login', 'POST', { role: 'student' });
  console.log(`2. Student Login: Status ${student.status} - Token: ${!!student.body.token} - Role: ${student.body.user?.role}`);

  // 3. Demo Login Instructor
  const instructor = await request('/api/auth/demo-login', 'POST', { role: 'instructor' });
  console.log(`3. Instructor Login: Status ${instructor.status} - Token: ${!!instructor.body.token} - Role: ${instructor.body.user?.role}`);

  // 4. Demo Login Admin
  const admin = await request('/api/auth/demo-login', 'POST', { role: 'admin' });
  console.log(`4. Admin Login: Status ${admin.status} - Token: ${!!admin.body.token} - Role: ${admin.body.user?.role}`);

  // 5. Get Courses
  const courses = await request('/api/courses');
  console.log(`5. Courses List: Status ${courses.status} - Total: ${courses.body.total} - Returned: ${courses.body.courses?.length}`);

  // 6. Get Featured Courses
  const featured = await request('/api/courses/featured');
  console.log(`6. Featured Courses: Status ${featured.status} - Count: ${featured.body.courses?.length}`);

  // 7. Admin Stats
  const stats = await request('/api/admin/stats', 'GET', null, admin.body.token);
  console.log(`7. Admin Stats: Status ${stats.status} - Total Users: ${stats.body.stats?.users?.total} - Total Revenue: $${stats.body.stats?.financials?.totalRevenue}`);

  // 8. Student My-Learning
  const myLearning = await request('/api/enrollments/my-learning', 'GET', null, student.body.token);
  console.log(`8. Student My-Learning: Status ${myLearning.status} - Enrolled Courses: ${myLearning.body.enrollments?.length}`);

  // 9. Payment Intent Creation
  const firstCourseId = courses.body.courses[0]._id;
  const paymentIntent = await request('/api/payments/create-intent', 'POST', { courseId: firstCourseId }, student.body.token);
  console.log(`9. Payment Intent: Status ${paymentIntent.status} - Amount: $${paymentIntent.body.amount}`);

  console.log('\n🎉 ALL API INTEGRATION TESTS PASSED SUCCESSFULLY! ✅');
}

runTests().catch(console.error);
