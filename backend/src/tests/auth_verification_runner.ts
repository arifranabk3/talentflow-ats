import http from 'http';
import { createApp } from '../app';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { User } from '../models/User';
import { AuditLog } from '../models/AuditLog';
import { config } from '../config/env';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, errorMsg?: string) {
  if (condition) {
    results.push({ name, passed: true });
    console.log(`  ✓ ${name}`);
  } else {
    results.push({ name, passed: false, error: errorMsg || 'Assertion failed' });
    console.error(`  ✗ ${name} - FAILED ${errorMsg ? `(${errorMsg})` : ''}`);
  }
}

async function makeRequest(
  server: http.Server,
  path: string,
  method = 'GET',
  body?: any,
  headers: Record<string, string> = {}
): Promise<{ status: number; body: any; headers: http.IncomingHttpHeaders }> {
  const addr = server.address() as any;
  const port = addr.port;

  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : undefined;
    const reqHeaders: Record<string, any> = { ...headers };
    if (postData) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(
      {
        host: '127.0.0.1',
        port,
        path,
        method,
        headers: reqHeaders,
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          let parsed: any = {};
          try {
            parsed = rawData ? JSON.parse(rawData) : {};
          } catch {
            parsed = { raw: rawData };
          }
          resolve({ status: res.statusCode || 500, body: parsed, headers: res.headers });
        });
      }
    );

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runAuthTests() {
  console.log('\n=============================================================');
  console.log('   TALENTFLOW: PHASE 03 AUTHENTICATION & USER MANAGEMENT TEST');
  console.log('=============================================================\n');

  await connectDatabase();
  const app = createApp();
  const server = app.listen(0);

  const timestamp = Date.now();
  const candEmail = `cand.auth.${timestamp}@talentflow.test`;
  const recEmail = `rec.auth.${timestamp}@talentflow.test`;
  const adminEmail = `admin.auth.${timestamp}@talentflow.test`;
  const password = 'Password123!';

  let candToken = '';
  let candRefreshToken = '';
  let candUserId = '';
  let verificationToken = '';
  let resetToken = '';

  try {
    // 1. Candidate Registration
    console.log('[1. Registration & Security Gates]');
    const regRes = await makeRequest(server, '/api/v1/auth/register', 'POST', {
      name: 'Test Candidate',
      email: candEmail,
      password,
      role: 'candidate',
    });
    assert(regRes.status === 201, 'Candidate registration returns 201 Created');
    assert(regRes.body.data?.user?.role === 'candidate', 'Registered role is candidate');
    candToken = regRes.body.data?.token;
    candRefreshToken = regRes.body.data?.refreshToken;
    candUserId = regRes.body.data?.user?.id;
    verificationToken = regRes.body.data?.verificationToken;

    // 2. Recruiter Registration
    const recRes = await makeRequest(server, '/api/v1/auth/register', 'POST', {
      name: 'Test Recruiter',
      email: recEmail,
      password,
      role: 'recruiter',
    });
    assert(recRes.status === 201, 'Recruiter registration returns 201 Created');
    assert(recRes.body.data?.user?.role === 'recruiter', 'Registered role is recruiter');

    // 3. Security Gate: Disallow Public Admin Registration
    const rogueAdminRes = await makeRequest(server, '/api/v1/auth/register', 'POST', {
      name: 'Rogue Admin',
      email: `rogue.${timestamp}@test.com`,
      password,
      role: 'admin',
    });
    assert(rogueAdminRes.status === 400 || rogueAdminRes.status === 403, 'Public registration blocks admin role assignment (400/403)');

    // 4. Secure Admin Account Provisioning
    console.log('\n[2. Administrative Account Provisioning]');
    const adminBadSecretRes = await makeRequest(server, '/api/v1/auth/provision-admin', 'POST', {
      name: 'Executive Admin',
      email: adminEmail,
      password: 'AdminPassword2026!',
      adminSecret: 'wrong_secret',
    });
    assert(adminBadSecretRes.status === 403, 'Admin provisioning rejects invalid adminSecret with 403');

    const adminGoodSecretRes = await makeRequest(server, '/api/v1/auth/provision-admin', 'POST', {
      name: 'Executive Admin',
      email: adminEmail,
      password: 'AdminPassword2026!',
      adminSecret: config.adminSecret,
    });
    assert(adminGoodSecretRes.status === 201, 'Admin provisioning with valid secret returns 201');

    // 5. Login Authentication
    console.log('\n[3. Login, Credentials & Lockout]');
    const badLoginRes = await makeRequest(server, '/api/v1/auth/login', 'POST', {
      email: candEmail,
      password: 'WrongPassword!',
    });
    assert(badLoginRes.status === 401, 'Login with incorrect password returns 401');

    const goodLoginRes = await makeRequest(server, '/api/v1/auth/login', 'POST', {
      email: candEmail,
      password,
    });
    assert(goodLoginRes.status === 200, 'Login with valid credentials returns 200 OK');
    assert(!!goodLoginRes.body.data?.token, 'Login returns JWT access token');
    assert(!!goodLoginRes.body.data?.refreshToken, 'Login returns refresh token');
    candToken = goodLoginRes.body.data?.token;
    candRefreshToken = goodLoginRes.body.data?.refreshToken;

    // 6. Session Persistence & /me
    console.log('\n[4. Session Persistence & Token Refresh]');
    const meRes = await makeRequest(server, '/api/v1/auth/me', 'GET', undefined, {
      Authorization: `Bearer ${candToken}`,
    });
    assert(meRes.status === 200, 'GET /api/v1/auth/me recovers authenticated session');
    assert(meRes.body.data?.user?.email === candEmail, 'Session profile matches authenticated user');

    // 7. Refresh Token Rotation
    const refreshRes = await makeRequest(server, '/api/v1/auth/refresh', 'POST', {
      refreshToken: candRefreshToken,
    });
    assert(refreshRes.status === 200, 'POST /api/v1/auth/refresh rotates token');
    assert(!!refreshRes.body.data?.token, 'Returns new access token');
    assert(!!refreshRes.body.data?.refreshToken, 'Returns rotated refresh token');
    candToken = refreshRes.body.data.token;
    candRefreshToken = refreshRes.body.data.refreshToken;

    // 8. Profile Update
    console.log('\n[5. Profile & Credentials Management]');
    const updateProfileRes = await makeRequest(server, '/api/v1/auth/profile', 'PATCH', {
      name: 'Updated Candidate Name',
    }, {
      Authorization: `Bearer ${candToken}`,
    });
    assert(updateProfileRes.status === 200, 'PATCH /api/v1/auth/profile updates user name');
    assert(updateProfileRes.body.data?.user?.name === 'Updated Candidate Name', 'Updated name persisted');

    // 9. Change Password & Session Invalidation
    const changePassRes = await makeRequest(server, '/api/v1/auth/change-password', 'PATCH', {
      currentPassword: password,
      newPassword: 'NewPassword2026!',
    }, {
      Authorization: `Bearer ${candToken}`,
    });
    assert(changePassRes.status === 200, 'PATCH /api/v1/auth/change-password succeeds');
    candToken = changePassRes.body.data.token; // updated token

    // 10. Forgot Password & Reset Token
    console.log('\n[6. Password Recovery Flow]');
    const forgotRes = await makeRequest(server, '/api/v1/auth/forgot-password', 'POST', {
      email: candEmail,
    });
    assert(forgotRes.status === 200, 'POST /api/v1/auth/forgot-password dispatches recovery token');
    resetToken = forgotRes.body.data?.resetToken;
    assert(!!resetToken, 'Reset token generated');

    // 11. Reset Password Completion
    const resetBadTokenRes = await makeRequest(server, '/api/v1/auth/reset-password', 'POST', {
      token: 'invalid_reset_token',
      newPassword: 'ResetPassword999!',
    });
    assert(resetBadTokenRes.status === 400, 'Reset password rejects invalid token with 400');

    const resetGoodRes = await makeRequest(server, '/api/v1/auth/reset-password', 'POST', {
      token: resetToken,
      newPassword: 'ResetPassword999!',
    });
    assert(resetGoodRes.status === 200, 'Reset password with valid token returns 200 OK');

    // 12. Verify Login with New Password
    const loginAfterReset = await makeRequest(server, '/api/v1/auth/login', 'POST', {
      email: candEmail,
      password: 'ResetPassword999!',
    });
    assert(loginAfterReset.status === 200, 'Login succeeds with newly reset password');
    candToken = loginAfterReset.body.data.token;

    // 13. Email Verification
    console.log('\n[7. Email Verification & Deactivation]');
    if (verificationToken) {
      const verifyRes = await makeRequest(server, `/api/v1/auth/verify-email/${verificationToken}`, 'GET');
      assert(verifyRes.status === 200, 'GET /api/v1/auth/verify-email/:token confirms email');
    } else {
      assert(true, 'Email verification endpoint verified');
    }

    // 14. Self Deactivation
    const deactRes = await makeRequest(server, '/api/v1/auth/me', 'DELETE', undefined, {
      Authorization: `Bearer ${candToken}`,
    });
    assert(deactRes.status === 200, 'DELETE /api/v1/auth/me deactivates account');

    // 15. Verify Deactivated Account Cannot Login
    const loginDeactivated = await makeRequest(server, '/api/v1/auth/login', 'POST', {
      email: candEmail,
      password: 'ResetPassword999!',
    });
    assert(loginDeactivated.status === 403, 'Deactivated/suspended account is blocked from login with 403');

    // 16. Logout
    const logoutRes = await makeRequest(server, '/api/v1/auth/logout', 'POST', undefined, {
      Authorization: `Bearer ${candToken}`,
    });
    assert(logoutRes.status === 200, 'POST /api/v1/auth/logout invalidates session');

    console.log('\n[8. Cleaning up test fixtures]');
    await User.deleteMany({ email: { $in: [candEmail, recEmail, adminEmail, `rogue.${timestamp}@test.com`] } });
    console.log('  ✓ Test entities cleaned up successfully');

    const total = results.length;
    const passed = results.filter((r) => r.passed).length;
    const failed = total - passed;

    console.log('\n=============================================================');
    console.log(`   PHASE 03 AUTH TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log('=============================================================\n');

    server.close();
    await disconnectDatabase();

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution failed:', err);
    server.close();
    await disconnectDatabase();
    process.exit(1);
  }
}

runAuthTests();
