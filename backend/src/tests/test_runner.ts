import http from 'http';
import mongoose, { Types } from 'mongoose';
import { createApp } from '../app';
import { hashPassword, comparePassword, generateToken, verifyToken } from '../utils/auth';
import { registerSchema, loginSchema } from '../validators/authValidator';
import { connectDatabase, disconnectDatabase } from '../config/database';
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

    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

export async function runBackendVerification() {
  console.log('\n=============================================================');
  console.log('   TALENTFLOW BACKEND SUITE: VERIFICATION TEST RUNNER');
  console.log('=============================================================\n');

  let server: http.Server | null = null;

  try {
    const app = createApp();
    server = app.listen(0);

    // 1. Health & Infrastructure
    console.log('1. Health & Infrastructure Endpoints:');
    const healthRes = await makeRequest(server, '/api/v1/health', 'GET');
    assert(healthRes.status === 200, 'GET /api/v1/health returns 200 OK', 'Health');
    assert(healthRes.body?.status === 'healthy', 'Body contains status: "healthy"', 'Health');
    assert(
      healthRes.body?.system?.includes('TALENTFLOW'),
      'Body identifies TALENTFLOW Enterprise ATS',
      'Health'
    );

    const notFoundRes = await makeRequest(server, '/api/v1/non-existent-route', 'GET');
    assert(notFoundRes.status === 404, 'Unmapped endpoint returns 404', 'Routing');
    assert(notFoundRes.body?.error?.code === 'NOT_FOUND', 'Returns standardized NOT_FOUND error code', 'Routing');

    // 2. Cryptography & Security Utilities
    console.log('\n2. Cryptography & Security Utilities:');
    const password = 'StrongPassword123!';
    const hashed = await hashPassword(password);
    assert(hashed.startsWith('$2b$12$') || hashed.startsWith('$2a$12$'), 'Password hashed with bcrypt cost factor 12', 'Security');

    const isValid = await comparePassword(password, hashed);
    assert(isValid === true, 'comparePassword verifies valid plaintext password', 'Security');

    const isInvalid = await comparePassword('WrongPassword!', hashed);
    assert(isInvalid === false, 'comparePassword rejects invalid password', 'Security');

    // 3. JWT Signing & Role Token Encoding
    console.log('\n3. JWT Signing & Role Token Encoding:');
    const candidatePayload = { userId: 'usr_candidate_01', email: 'candidate@example.com', role: 'candidate' as const };
    const recruiterPayload = { userId: 'usr_recruiter_01', email: 'recruiter@example.com', role: 'recruiter' as const };
    const adminPayload = { userId: 'usr_admin_01', email: 'admin@example.com', role: 'admin' as const };

    const token = generateToken(candidatePayload);
    assert(typeof token === 'string' && token.split('.').length === 3, 'Token generated in standard header.payload.signature format', 'Auth');

    const decoded = verifyToken(token);
    assert(decoded.role === 'candidate', 'Decoded token preserves user role', 'Auth');
    assert(decoded.email === candidatePayload.email, 'Decoded token preserves email', 'Auth');

    // 4. Zod Request Body Validation Tests
    console.log('\n4. Zod Request Body Validation Tests:');
    const validReg = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'StrongPassword123!',
        role: 'candidate',
      },
    };
    const regResult = registerSchema.safeParse(validReg);
    assert(regResult.success === true, 'Valid registration payload passes Zod schema', 'Validation');

    const invalidReg = {
      body: {
        name: 'J',
        email: 'invalid-email',
        password: 'short',
      },
    };
    const regFail = registerSchema.safeParse(invalidReg);
    assert(regFail.success === false, 'Malformed email and short password fail Zod schema', 'Validation');

    const validLogin = { body: { email: 'john@example.com', password: 'Password123!' } };
    assert(loginSchema.safeParse(validLogin).success === true, 'Valid login payload passes Zod schema', 'Validation');

    const invalidLogin = { body: { email: 'john@example.com', password: '' } };
    assert(loginSchema.safeParse(invalidLogin).success === false, 'Empty password fails Zod schema', 'Validation');

    // 5. Mongoose Data Models & Indexes Verification
    console.log('\n5. Mongoose Data Models & Indexes Verification:');
    assert(User.modelName === 'User', 'User model is properly registered', 'Models');
    assert(!!User.schema.paths.passwordHash, 'User model contains passwordHash', 'Models');
    assert(Company.modelName === 'Company', 'Company model is properly registered', 'Models');
    assert(CompanyMember.modelName === 'CompanyMember', 'CompanyMember model is properly registered', 'Models');
    assert(Job.modelName === 'Job', 'Job model is properly registered', 'Models');
    assert(CandidateProfile.modelName === 'CandidateProfile', 'CandidateProfile model is properly registered', 'Models');
    assert(Resume.modelName === 'Resume', 'Resume model is properly registered', 'Models');
    assert(Application.modelName === 'Application', 'Application model is properly registered', 'Models');
    assert(Interview.modelName === 'Interview', 'Interview model is properly registered', 'Models');
    assert(Message.modelName === 'Message', 'Message model is properly registered', 'Models');
    assert(Notification.modelName === 'Notification', 'Notification model is properly registered', 'Models');
    assert(AuditLog.modelName === 'AuditLog', 'AuditLog model is properly registered', 'Models');

    // 6. API Security & Middleware Interception Tests
    console.log('\n6. API Security & Middleware Interception Tests:');
    const unauthMe = await makeRequest(server, '/api/v1/auth/me', 'GET');
    assert(unauthMe.status === 401, 'GET /api/v1/auth/me returns 401 when token is missing', 'Middleware');
    assert(unauthMe.body.error?.code === 'UNAUTHORIZED', 'Returns standardized UNAUTHORIZED code', 'Middleware');

    const badTokenMe = await makeRequest(server, '/api/v1/auth/me', 'GET', undefined, {
      Authorization: 'Bearer invalid.jwt.token.string',
    });
    assert(badTokenMe.status === 401, 'GET /api/v1/auth/me returns 401 on invalid token signature', 'Middleware');
    assert(badTokenMe.body.error?.code === 'INVALID_TOKEN', 'Returns INVALID_TOKEN code', 'Middleware');

    // 7. Live Database Integration & Phase 03 ATS Pipeline Verification
    console.log('\n7. Live Database Integration & Phase 03 ATS Pipeline Verification:');
    await connectDatabase();
    assert(mongoose.connection.readyState === 1, 'MongoDB Atlas connection established for Phase 03 test', 'Atlas DB');

    // Clean up any old test records
    const testTag = `p3_test_${Date.now()}`;
    const testRecruiterEmail = `${testTag}_recruiter@talentflow-test.io`;
    const testCandidateEmail = `${testTag}_candidate@talentflow-test.io`;

    // Seed test recruiter & candidate in live DB
    const [recruiterDoc, candidateDoc] = await Promise.all([
      User.create({
        name: 'ATS Recruiter Tester',
        email: testRecruiterEmail,
        passwordHash: await hashPassword('RecruiterPass123!'),
        role: 'recruiter',
        status: 'active',
        emailVerified: true,
      }),
      User.create({
        name: 'ATS Candidate Tester',
        email: testCandidateEmail,
        passwordHash: await hashPassword('CandidatePass123!'),
        role: 'candidate',
        status: 'active',
        emailVerified: true,
      }),
    ]);

    const recruiterToken = generateToken({
      userId: recruiterDoc._id.toString(),
      email: recruiterDoc.email,
      role: 'recruiter',
    });

    const candidateToken = generateToken({
      userId: candidateDoc._id.toString(),
      email: candidateDoc.email,
      role: 'candidate',
    });

    // MODULE 1: Company Management
    console.log('\n  [Module 1: Company Management]');
    const createCompanyRes = await makeRequest(
      server,
      '/api/v1/companies',
      'POST',
      {
        name: `Acme ATS Corp ${testTag}`,
        description: 'Next-gen talent acquisition software company',
        industry: 'Software',
        location: 'San Francisco, CA',
        companySize: '51-200',
      },
      { Authorization: `Bearer ${recruiterToken}` }
    );
    assert(createCompanyRes.status === 201, 'POST /api/v1/companies creates company and returns 201', 'Module 1');
    const companyId = createCompanyRes.body?.data?._id;
    assert(!!companyId, 'Created company returns valid ID', 'Module 1');

    // Verify creator became owner in CompanyMember
    const membership = await CompanyMember.findOne({ companyId, userId: recruiterDoc._id });
    assert(membership?.role === 'owner', 'Creator automatically designated company owner', 'Module 1');

    // GET /api/v1/companies
    const listCompaniesRes = await makeRequest(server, '/api/v1/companies', 'GET');
    assert(listCompaniesRes.status === 200, 'GET /api/v1/companies returns list of companies', 'Module 1');

    // PATCH /api/v1/companies/:id
    const updateCompanyRes = await makeRequest(
      server,
      `/api/v1/companies/${companyId}`,
      'PATCH',
      { description: 'Updated company description' },
      { Authorization: `Bearer ${recruiterToken}` }
    );
    assert(updateCompanyRes.status === 200, 'PATCH /api/v1/companies/:id updates company', 'Module 1');
    assert(updateCompanyRes.body?.data?.description === 'Updated company description', 'Updated description persisted', 'Module 1');

    // MODULE 2: Company Members
    console.log('\n  [Module 2: Company Members]');
    const inviteRes = await makeRequest(
      server,
      `/api/v1/companies/${companyId}/invitations`,
      'POST',
      { email: `${testTag}_colleague@talentflow-test.io`, role: 'hiring_manager' },
      { Authorization: `Bearer ${recruiterToken}` }
    );
    assert(inviteRes.status === 201, 'POST /api/v1/companies/:id/invitations invites team member', 'Module 2');
    const invitedMemberId = inviteRes.body?.data?._id;

    const listMembersRes = await makeRequest(
      server,
      `/api/v1/companies/${companyId}/members`,
      'GET',
      undefined,
      { Authorization: `Bearer ${recruiterToken}` }
    );
    assert(listMembersRes.status === 200 && listMembersRes.body?.data?.count >= 2, 'GET /api/v1/companies/:id/members lists members', 'Module 2');

    // Protect last owner check
    const demoteOwnerRes = await makeRequest(
      server,
      `/api/v1/companies/${companyId}/members/${membership?._id}`,
      'PATCH',
      { role: 'recruiter' },
      { Authorization: `Bearer ${recruiterToken}` }
    );
    assert(demoteOwnerRes.status === 400, 'Prevent demoting the last active owner of company', 'Module 2');

    // MODULE 3: Job Management CRUD & Lifecycle
    console.log('\n  [Module 3: Job Management CRUD]');
    const createJobRes = await makeRequest(
      server,
      '/api/v1/jobs',
      'POST',
      {
        companyId,
        title: `Senior Full Stack Engineer ${testTag}`,
        description: 'Lead engineering initiatives building scalable cloud ATS platforms',
        responsibilities: ['Build APIs', 'Scale databases'],
        requirements: ['5+ years Node.js', 'MongoDB', 'TypeScript'],
        location: 'Remote, US',
        employmentType: 'full-time',
        workplaceType: 'remote',
        skills: ['TypeScript', 'Node.js', 'MongoDB', 'React'],
        status: 'draft',
      },
      { Authorization: `Bearer ${recruiterToken}` }
    );
    assert(createJobRes.status === 201, 'POST /api/v1/jobs creates job in draft status', 'Module 3');
    const jobId = createJobRes.body?.data?._id;

    // Candidates should not see draft job in public listing
    const publicJobsRes = await makeRequest(server, `/api/v1/jobs?search=${testTag}`, 'GET');
    const foundDraft = publicJobsRes.body?.data?.jobs?.some((j: any) => j._id === jobId);
    assert(!foundDraft, 'Draft jobs hidden from public/candidate search listings', 'Module 3');

    // Publish Job
    const publishRes = await makeRequest(
      server,
      `/api/v1/jobs/${jobId}/publish`,
      'PATCH',
      {},
      { Authorization: `Bearer ${recruiterToken}` }
    );
    assert(publishRes.status === 200 && publishRes.body?.data?.status === 'published', 'PATCH /api/v1/jobs/:id/publish publishes job opening', 'Module 3');

    // Candidate can now find published job
    const candidateBrowseRes = await makeRequest(
      server,
      `/api/v1/jobs?skills=TypeScript`,
      'GET',
      undefined,
      { Authorization: `Bearer ${candidateToken}` }
    );
    assert(candidateBrowseRes.status === 200, 'GET /api/v1/jobs supports skill search filtering', 'Module 3');

    // MODULE 4: Candidate Profile
    console.log('\n  [Module 4: Candidate Profile]');
    const myProfileRes = await makeRequest(
      server,
      '/api/v1/candidates/me',
      'GET',
      undefined,
      { Authorization: `Bearer ${candidateToken}` }
    );
    assert(myProfileRes.status === 200, 'GET /api/v1/candidates/me retrieves candidate self-profile', 'Module 4');

    const updateProfileRes = await makeRequest(
      server,
      '/api/v1/candidates/me',
      'PATCH',
      {
        headline: 'Staff Backend Architect',
        summary: 'Experienced distributed systems engineer passionate about high-throughput APIs',
        skills: ['TypeScript', 'Node.js', 'MongoDB', 'Docker', 'GraphQL'],
        location: 'New York, NY',
        experience: [
          {
            title: 'Lead Architect',
            company: 'TechCorp',
            startDate: '2021-01-01',
            current: true,
            description: 'Architecting distributed cloud microservices',
          },
        ],
      },
      { Authorization: `Bearer ${candidateToken}` }
    );
    assert(updateProfileRes.status === 200, 'PATCH /api/v1/candidates/me updates candidate profile', 'Module 4');
    assert(updateProfileRes.body?.data?.skills?.length === 5, 'Skills array properly saved and retrieved', 'Module 4');

    // Seed mock Resume metadata for candidate
    const resumeDoc = await Resume.create({
      candidateId: candidateDoc._id,
      fileName: 'Staff_Architect_Resume.pdf',
      fileType: 'application/pdf',
      fileSize: 1024 * 350,
      storageKey: `resumes/${candidateDoc._id}/resume_${testTag}.pdf`,
    });

    // MODULE 5: Application Management & Submissions
    console.log('\n  [Module 5: Application Management]');
    const applyRes = await makeRequest(
      server,
      `/api/v1/jobs/${jobId}/applications`,
      'POST',
      {
        resumeId: resumeDoc._id.toString(),
        coverLetter: 'I am excited to apply for this Senior Full Stack Engineer opening.',
      },
      { Authorization: `Bearer ${candidateToken}` }
    );
    assert(applyRes.status === 201, 'POST /api/v1/jobs/:jobId/applications candidate successfully applies', 'Module 5');
    const applicationId = applyRes.body?.data?._id;

    // Prevent duplicate application
    const duplicateApplyRes = await makeRequest(
      server,
      `/api/v1/jobs/${jobId}/applications`,
      'POST',
      { resumeId: resumeDoc._id.toString() },
      { Authorization: `Bearer ${candidateToken}` }
    );
    assert(duplicateApplyRes.status === 409, 'Rejects duplicate application for same job with 409', 'Module 5');

    // Candidate views own applications
    const myAppsRes = await makeRequest(
      server,
      '/api/v1/applications/me',
      'GET',
      undefined,
      { Authorization: `Bearer ${candidateToken}` }
    );
    assert(myAppsRes.status === 200 && myAppsRes.body?.data?.count === 1, 'GET /api/v1/applications/me returns candidate applications', 'Module 5');

    // Recruiter views company applications
    const companyAppsRes = await makeRequest(
      server,
      `/api/v1/applications/company/${companyId}`,
      'GET',
      undefined,
      { Authorization: `Bearer ${recruiterToken}` }
    );
    assert(companyAppsRes.status === 200 && companyAppsRes.body?.data?.applications?.length === 1, 'GET /api/v1/applications/company/:id lists company pipeline', 'Module 5');

    // MODULE 6: Application Pipeline & Stage Transitions
    console.log('\n  [Module 6: Application Pipeline & State Machine]');
    // Step 1: applied -> screening
    const toScreeningRes = await makeRequest(
      server,
      `/api/v1/applications/${applicationId}/status`,
      'PATCH',
      { status: 'screening', reason: 'Resume matched 95% of job requirements.' },
      { Authorization: `Bearer ${recruiterToken}` }
    );
    assert(toScreeningRes.status === 200 && toScreeningRes.body?.data?.status === 'screening', 'Advances stage from applied -> screening', 'Module 6');

    // Step 2: screening -> interview
    const toInterviewRes = await makeRequest(
      server,
      `/api/v1/applications/${applicationId}/status`,
      'PATCH',
      { status: 'interview', reason: 'Initial screening call passed.' },
      { Authorization: `Bearer ${recruiterToken}` }
    );
    assert(toInterviewRes.status === 200 && toInterviewRes.body?.data?.status === 'interview', 'Advances stage from screening -> interview', 'Module 6');

    // Step 3: Invalid jump test: interview cannot jump directly to hired (must go through offered)
    const invalidJumpRes = await makeRequest(
      server,
      `/api/v1/applications/${applicationId}/status`,
      'PATCH',
      { status: 'hired' },
      { Authorization: `Bearer ${recruiterToken}` }
    );
    assert(invalidJumpRes.status === 400, 'Invalid transition (interview -> hired without offer) rejected with 400', 'Module 6');

    // Step 4: interview -> offered -> hired
    await makeRequest(
      server,
      `/api/v1/applications/${applicationId}/status`,
      'PATCH',
      { status: 'offered' },
      { Authorization: `Bearer ${recruiterToken}` }
    );
    const toHiredRes = await makeRequest(
      server,
      `/api/v1/applications/${applicationId}/status`,
      'PATCH',
      { status: 'hired', reason: 'Candidate signed offer letter.' },
      { Authorization: `Bearer ${recruiterToken}` }
    );
    assert(toHiredRes.status === 200 && toHiredRes.body?.data?.status === 'hired', 'Advances stage from offered -> hired', 'Module 6');

    // Recruiter updates evaluation notes
    const updateNotesRes = await makeRequest(
      server,
      `/api/v1/applications/${applicationId}/notes`,
      'PATCH',
      { recruiterNotes: 'Exceptional system architecture understanding. Outstanding candidate.' },
      { Authorization: `Bearer ${recruiterToken}` }
    );
    assert(updateNotesRes.status === 200, 'PATCH /api/v1/applications/:id/notes updates internal evaluation notes', 'Module 6');

    // Audit Log Verification
    const auditLogs = await AuditLog.find({ resourceId: applicationId });
    assert(auditLogs.length >= 3, 'Application lifecycle transitions recorded in append-only AuditLog', 'Module 6');

    // Teardown: Clean up test fixtures created in this test run (AuditLog is append-only by design)
    await Application.deleteMany({ _id: applicationId });
    await Resume.deleteMany({ _id: resumeDoc._id });
    await Job.deleteMany({ _id: jobId });
    await CompanyMember.deleteMany({ companyId });
    await Company.deleteMany({ _id: companyId });
    await User.deleteMany({ _id: { $in: [recruiterDoc._id, candidateDoc._id] } });

    await disconnectDatabase();
    assert(true, 'Test fixtures safely cleaned up and DB connection closed cleanly', 'Teardown');

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
