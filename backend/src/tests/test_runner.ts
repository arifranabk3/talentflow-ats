import http from 'http';
import mongoose from 'mongoose';
import { createApp } from '../app';
import { hashPassword, comparePassword, generateToken, verifyToken } from '../utils/auth';
import { registerSchema, loginSchema } from '../validators/authValidator';
import {
  User,
  Company,
  CompanyMember,
  Job,
  CandidateProfile,
  Resume,
  Application,
  Interview,
  Message,
  Notification,
  AuditLog,
} from '../models';

interface TestResult {
  suite: string;
  test: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, test: string, suite: string, errorMsg?: string) {
  if (condition) {
    results.push({ suite, test, passed: true });
    console.log(`  ✓ [${suite}] ${test}`);
  } else {
    results.push({ suite, test, passed: false, error: errorMsg || 'Assertion failed' });
    console.error(`  ✗ [${suite}] ${test} - FAILED ${errorMsg ? `(${errorMsg})` : ''}`);
  }
}

async function makeRequest(
  server: http.Server,
  path: string,
  method = 'GET',
  body?: any,
  headers: Record<string, string> = {}
): Promise<{ status: number; body: any }> {
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
        res.on('data', (chunk) => (rawData += chunk));
        res.on('end', () => {
          try {
            const parsed = rawData ? JSON.parse(rawData) : null;
            resolve({ status: res.statusCode || 500, body: parsed });
          } catch {
            resolve({ status: res.statusCode || 500, body: rawData });
          }
        });
      }
    );

    req.on('error', (err) => reject(err));
    if (postData) req.write(postData);
    req.end();
  });
}

async function runBackendVerification() {
  console.log('\n=============================================================');
  console.log('   TALENTFLOW BACKEND SUITE: VERIFICATION TEST RUNNER');
  console.log('=============================================================\n');

  let server: http.Server | null = null;

  try {
    const app = createApp();
    server = app.listen(0);

    // 1. Health Endpoint Test
    console.log('1. Health & Infrastructure Endpoints:');
    const health = await makeRequest(server, '/api/v1/health');
    assert(health.status === 200, 'GET /api/v1/health returns 200 OK', 'Health');
    assert(health.body.status === 'healthy', 'Body contains status: "healthy"', 'Health');
    assert(health.body.system.includes('TALENTFLOW'), 'Body identifies TALENTFLOW Enterprise ATS', 'Health');

    // 2. 404 Endpoint Test
    const notFound = await makeRequest(server, '/api/v1/unknown-endpoint');
    assert(notFound.status === 404, 'Unmapped endpoint returns 404', 'Routing');
    assert(notFound.body.error?.code === 'NOT_FOUND', 'Returns standardized NOT_FOUND error code', 'Routing');

    // 3. Password Hashing & Bcrypt Security
    console.log('\n2. Cryptography & Security Utilities:');
    const rawPass = 'EnterpriseSecret2026!';
    const hashed = await hashPassword(rawPass);
    assert(hashed.startsWith('$2b$12$') || hashed.startsWith('$2a$12$'), 'Password hashed with bcrypt cost factor 12', 'Security');
    const passMatches = await comparePassword(rawPass, hashed);
    assert(passMatches, 'comparePassword verifies valid plaintext password', 'Security');
    const wrongPassMatches = await comparePassword('WrongPassword', hashed);
    assert(!wrongPassMatches, 'comparePassword rejects invalid password', 'Security');

    // 4. JWT Signing & Verification
    console.log('\n3. JWT Signing & Role Token Encoding:');
    const token = generateToken({
      userId: '666000000000000000000001',
      email: 'recruiter@talentflow.enterprise',
      role: 'recruiter',
    });
    assert(typeof token === 'string' && token.split('.').length === 3, 'Token generated in standard header.payload.signature format', 'Auth');
    const decoded = verifyToken(token);
    assert(decoded.role === 'recruiter', 'Decoded token preserves user role', 'Auth');
    assert(decoded.email === 'recruiter@talentflow.enterprise', 'Decoded token preserves email', 'Auth');

    // 5. Schema & Zod Request Body Validation
    console.log('\n4. Zod Request Body Validation Tests:');
    const validRegister = registerSchema.safeParse({
      body: {
        name: 'Sarah Jenkins',
        email: 'sarah.j@acmetech.io',
        password: 'SuperSecurePassword2026!',
        role: 'recruiter',
      },
    });
    assert(validRegister.success, 'Valid registration payload passes Zod schema', 'Validation');

    const invalidEmailRegister = registerSchema.safeParse({
      body: {
        name: 'S',
        email: 'not-an-email-address',
        password: '123',
      },
    });
    assert(!invalidEmailRegister.success, 'Malformed email and short password fail Zod schema', 'Validation');

    const validLogin = loginSchema.safeParse({
      body: {
        email: 'test@talentflow.io',
        password: 'SecretPassword!',
      },
    });
    assert(validLogin.success, 'Valid login payload passes Zod schema', 'Validation');

    const emptyLogin = loginSchema.safeParse({
      body: {
        email: 'test@talentflow.io',
        password: '',
      },
    });
    assert(!emptyLogin.success, 'Empty password fails Zod schema', 'Validation');

    // 6. Mongoose Schema Definitions & Rules
    console.log('\n5. Mongoose Data Models & Indexes Verification:');
    
    // User Model
    assert(User.modelName === 'User', 'User model is properly registered', 'Models');
    assert(!!User.schema.paths.passwordHash, 'User model contains passwordHash', 'Models');
    assert(!!User.schema.paths.email, 'User model contains email', 'Models');

    // Company Model
    assert(Company.modelName === 'Company', 'Company model is properly registered', 'Models');
    assert(!!Company.schema.paths.slug, 'Company model contains slug', 'Models');
    assert(!!Company.schema.paths.verificationStatus, 'Company model contains verificationStatus', 'Models');

    // CompanyMember Model
    assert(CompanyMember.modelName === 'CompanyMember', 'CompanyMember model is properly registered', 'Models');
    assert(!!CompanyMember.schema.paths.companyId, 'CompanyMember references companyId', 'Models');
    assert(!!CompanyMember.schema.paths.role, 'CompanyMember defines role hierarchy', 'Models');

    // Job Model
    assert(Job.modelName === 'Job', 'Job model is properly registered', 'Models');
    assert(!!Job.schema.paths.companyId, 'Job model references companyId', 'Models');
    assert(!!Job.schema.paths.status, 'Job model contains status lifecycle', 'Models');

    // CandidateProfile Model
    assert(CandidateProfile.modelName === 'CandidateProfile', 'CandidateProfile model is properly registered', 'Models');
    assert(!!CandidateProfile.schema.paths.userId, 'CandidateProfile references userId', 'Models');

    // Resume Model (Ensuring no raw binary storage)
    assert(Resume.modelName === 'Resume', 'Resume model is properly registered', 'Models');
    assert(!!Resume.schema.paths.storageKey, 'Resume stores storageKey (no raw binary in MongoDB)', 'Models');

    // Application Model (Compound index & status)
    assert(Application.modelName === 'Application', 'Application model is properly registered', 'Models');
    assert(!!Application.schema.paths.jobId, 'Application model references jobId', 'Models');
    assert(!!Application.schema.paths.candidateId, 'Application model references candidateId', 'Models');

    // Interview Model
    assert(Interview.modelName === 'Interview', 'Interview model is properly registered', 'Models');
    assert(!!Interview.schema.paths.interviewType, 'Interview model defines interviewType', 'Models');

    // Message Model
    assert(Message.modelName === 'Message', 'Message model is properly registered', 'Models');
    assert(!!Message.schema.paths.conversationId, 'Message model indexes conversationId', 'Models');

    // Notification Model
    assert(Notification.modelName === 'Notification', 'Notification model is properly registered', 'Models');

    // AuditLog Model (Immutable append-only)
    assert(AuditLog.modelName === 'AuditLog', 'AuditLog model is properly registered', 'Models');
    assert(!!AuditLog.schema.paths.action, 'AuditLog defines action', 'Models');
    assert(!!AuditLog.schema.paths.actorId, 'AuditLog tracks actorId', 'Models');

    // 7. Protected Route Authorization Tests
    console.log('\n6. API Security & Middleware Interception Tests:');
    
    // Auth required without token
    const unauthMe = await makeRequest(server, '/api/v1/auth/me', 'GET');
    assert(unauthMe.status === 401, 'GET /api/v1/auth/me returns 401 when token is missing', 'Middleware');
    assert(unauthMe.body.error?.code === 'UNAUTHORIZED', 'Returns standardized UNAUTHORIZED code', 'Middleware');

    // Auth with invalid token
    const badTokenMe = await makeRequest(server, '/api/v1/auth/me', 'GET', undefined, {
      Authorization: 'Bearer invalid.jwt.token.string',
    });
    assert(badTokenMe.status === 401, 'GET /api/v1/auth/me returns 401 on invalid token signature', 'Middleware');
    assert(badTokenMe.body.error?.code === 'INVALID_TOKEN', 'Returns INVALID_TOKEN code', 'Middleware');

  } catch (err: any) {
    console.error('Test execution error:', err);
    assert(false, `Test execution failed with error: ${err.message}`, 'Fatal');
  } finally {
    if (server) {
      server.close();
    }
  }

  // Summary
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log('\n=============================================================');
  console.log(`   TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('=============================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runBackendVerification();
