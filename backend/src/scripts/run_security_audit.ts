import http from 'http';
import mongoose, { Types } from 'mongoose';
import { createApp } from '../app';
import { hashPassword, generateToken } from '../utils/auth';
import { connectDatabase, disconnectDatabase } from '../config/database';
import {
  User,
  Company,
  CompanyMember,
  Job,
  CandidateProfile,
  Resume,
  Application,
  AuditLog,
} from '../models';

interface SecurityCheckResult {
  category: string;
  name: string;
  passed: boolean;
  expectedStatus: number;
  actualStatus: number;
  details?: string;
}

const auditResults: SecurityCheckResult[] = [];

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
    if (postData) req.write(postData);
    req.end();
  });
}

function recordResult(
  category: string,
  name: string,
  condition: boolean,
  expectedStatus: number,
  actualStatus: number,
  details?: string
) {
  auditResults.push({
    category,
    name,
    passed: condition,
    expectedStatus,
    actualStatus,
    details,
  });
  if (condition) {
    console.log(`  ✓ [${category}] ${name}`);
  } else {
    console.error(`  ✗ [${category}] ${name} (Expected ${expectedStatus}, got ${actualStatus}) - ${details || ''}`);
  }
}

export async function runSecurityVerification() {
  console.log('\n=============================================================');
  console.log('   TALENTFLOW ATS: COMPREHENSIVE SECURITY & MULTI-TENANCY AUDIT');
  console.log('=============================================================\n');

  let server: http.Server | null = null;
  const tag = `sec_audit_${Date.now()}`;

  try {
    const app = createApp();
    server = app.listen(0);

    await connectDatabase();

    // -------------------------------------------------------------
    // SEEDING MULTI-TENANT TEST FIXTURES
    // Tenant A: Company A (Owner A, Recruiter A, Job A1)
    // Tenant B: Company B (Owner B, Recruiter B, Job B1)
    // Candidate 1, Candidate 2
    // -------------------------------------------------------------
    console.log('1. Setting up Isolated Multi-Tenant Test Entities...');

    // Users
    const passwordHash = await hashPassword('SecurePass123!');
    const [ownerA, recruiterA, ownerB, recruiterB, candidate1, candidate2] = await Promise.all([
      User.create({ name: 'Owner Alpha', email: `owner_a_${tag}@test.io`, passwordHash, role: 'recruiter', status: 'active', emailVerified: true }),
      User.create({ name: 'Recruiter Alpha', email: `rec_a_${tag}@test.io`, passwordHash, role: 'recruiter', status: 'active', emailVerified: true }),
      User.create({ name: 'Owner Beta', email: `owner_b_${tag}@test.io`, passwordHash, role: 'recruiter', status: 'active', emailVerified: true }),
      User.create({ name: 'Recruiter Beta', email: `rec_b_${tag}@test.io`, passwordHash, role: 'recruiter', status: 'active', emailVerified: true }),
      User.create({ name: 'Candidate One', email: `cand_1_${tag}@test.io`, passwordHash, role: 'candidate', status: 'active', emailVerified: true }),
      User.create({ name: 'Candidate Two', email: `cand_2_${tag}@test.io`, passwordHash, role: 'candidate', status: 'active', emailVerified: true }),
    ]);

    // Tokens
    const tokenOwnerA = generateToken({ userId: ownerA._id.toString(), email: ownerA.email, role: 'recruiter' });
    const tokenRecA = generateToken({ userId: recruiterA._id.toString(), email: recruiterA.email, role: 'recruiter' });
    const tokenOwnerB = generateToken({ userId: ownerB._id.toString(), email: ownerB.email, role: 'recruiter' });
    const tokenRecB = generateToken({ userId: recruiterB._id.toString(), email: recruiterB.email, role: 'recruiter' });
    const tokenCand1 = generateToken({ userId: candidate1._id.toString(), email: candidate1.email, role: 'candidate' });
    const tokenCand2 = generateToken({ userId: candidate2._id.toString(), email: candidate2.email, role: 'candidate' });

    // Companies
    const [companyA, companyB] = await Promise.all([
      Company.create({ name: `Tenant Alpha ${tag}`, slug: `tenant-alpha-${tag}`, verificationStatus: 'verified', createdBy: ownerA._id }),
      Company.create({ name: `Tenant Beta ${tag}`, slug: `tenant-beta-${tag}`, verificationStatus: 'verified', createdBy: ownerB._id }),
    ]);

    // Company Memberships
    await Promise.all([
      CompanyMember.create({ companyId: companyA._id, userId: ownerA._id, role: 'owner', status: 'active' }),
      CompanyMember.create({ companyId: companyA._id, userId: recruiterA._id, role: 'recruiter', status: 'active' }),
      CompanyMember.create({ companyId: companyB._id, userId: ownerB._id, role: 'owner', status: 'active' }),
      CompanyMember.create({ companyId: companyB._id, userId: recruiterB._id, role: 'recruiter', status: 'active' }),
    ]);

    // Jobs
    const [jobA, jobB] = await Promise.all([
      Job.create({
        companyId: companyA._id,
        createdBy: ownerA._id,
        title: `Engineer Alpha ${tag}`,
        slug: `eng-alpha-${tag}`,
        description: 'Role at Company Alpha',
        location: 'San Francisco, CA',
        employmentType: 'full-time',
        status: 'published',
      }),
      Job.create({
        companyId: companyB._id,
        createdBy: ownerB._id,
        title: `Engineer Beta ${tag}`,
        slug: `eng-beta-${tag}`,
        description: 'Role at Company Beta',
        location: 'New York, NY',
        employmentType: 'full-time',
        status: 'published',
      }),
    ]);

    // Candidate 1 Resumes & Profile
    const resume1 = await Resume.create({
      candidateId: candidate1._id,
      fileName: 'Candidate1_CV.pdf',
      fileType: 'application/pdf',
      fileSize: 1024 * 200,
      storageKey: `resumes/${candidate1._id}/cv_${tag}.pdf`,
    });

    const resume2 = await Resume.create({
      candidateId: candidate2._id,
      fileName: 'Candidate2_CV.pdf',
      fileType: 'application/pdf',
      fileSize: 1024 * 250,
      storageKey: `resumes/${candidate2._id}/cv_${tag}.pdf`,
    });

    await CandidateProfile.create({
      userId: candidate1._id,
      headline: 'Full Stack Engineer',
      skills: ['TypeScript', 'Node.js'],
    });

    await CandidateProfile.create({
      userId: candidate2._id,
      headline: 'DevOps Engineer',
      skills: ['Kubernetes', 'AWS'],
    });

    // Candidate 1 applies to Job A (Company A)
    const appA1 = await Application.create({
      jobId: jobA._id,
      candidateId: candidate1._id,
      companyId: companyA._id,
      resumeId: resume1._id,
      status: 'applied',
    });

    console.log('2. Executing Strict Security Checks...');

    // -------------------------------------------------------------
    // SECURITY CHECK 1: Cross-Company Access Denial
    // Recruiter B attempts to view or update Company A's applications
    // -------------------------------------------------------------
    console.log('\n  [Security Audit 1: Cross-Company Tenant Isolation]');
    const crossAccessRes = await makeRequest(
      server,
      `/api/v1/applications/company/${companyA._id}`,
      'GET',
      undefined,
      { Authorization: `Bearer ${tokenRecB}` }
    );
    recordResult(
      'Tenant Isolation',
      'Recruiter B is denied access to Company A candidate applications',
      crossAccessRes.status === 403,
      403,
      crossAccessRes.status,
      crossAccessRes.body?.error?.message
    );

    // Recruiter B attempts to modify status of Company A's application
    const crossUpdateRes = await makeRequest(
      server,
      `/api/v1/applications/${appA1._id}/status`,
      'PATCH',
      { status: 'screening' },
      { Authorization: `Bearer ${tokenRecB}` }
    );
    recordResult(
      'Tenant Isolation',
      'Recruiter B is denied modifying status of Company A application',
      crossUpdateRes.status === 403,
      403,
      crossUpdateRes.status
    );

    // Recruiter B attempts to update notes of Company A application
    const crossNotesRes = await makeRequest(
      server,
      `/api/v1/applications/${appA1._id}/notes`,
      'PATCH',
      { recruiterNotes: 'Malicious note injection' },
      { Authorization: `Bearer ${tokenRecB}` }
    );
    recordResult(
      'Tenant Isolation',
      'Recruiter B is denied writing notes to Company A application',
      crossNotesRes.status === 403,
      403,
      crossNotesRes.status
    );

    // -------------------------------------------------------------
    // SECURITY CHECK 2: Unauthorized Candidate Profile Access
    // Candidate 2 has NOT applied to Company A. Recruiter A attempts to inspect Candidate 2.
    // -------------------------------------------------------------
    console.log('\n  [Security Audit 2: Candidate PII & Profile Protection]');
    const cand2ProfileRes = await makeRequest(
      server,
      `/api/v1/candidates/${candidate2._id}`,
      'GET',
      undefined,
      { Authorization: `Bearer ${tokenRecA}` }
    );
    recordResult(
      'Privacy Boundary',
      'Recruiter A denied inspecting Candidate 2 (no applications to Company A)',
      cand2ProfileRes.status === 403,
      403,
      cand2ProfileRes.status,
      cand2ProfileRes.body?.error?.message
    );

    // Candidate 1 DID apply to Company A. Recruiter A should have legitimate access.
    const cand1ProfileRes = await makeRequest(
      server,
      `/api/v1/candidates/${candidate1._id}`,
      'GET',
      undefined,
      { Authorization: `Bearer ${tokenRecA}` }
    );
    recordResult(
      'Privacy Boundary',
      'Recruiter A allowed inspecting Candidate 1 (active application to Company A)',
      cand1ProfileRes.status === 200,
      200,
      cand1ProfileRes.status
    );

    // Candidate 2 attempts to read Candidate 1's profile directly
    const candToCandRes = await makeRequest(
      server,
      `/api/v1/candidates/${candidate1._id}`,
      'GET',
      undefined,
      { Authorization: `Bearer ${tokenCand2}` }
    );
    recordResult(
      'Privacy Boundary',
      'Candidate 2 denied viewing Candidate 1 profile',
      candToCandRes.status === 403,
      403,
      candToCandRes.status
    );

    // -------------------------------------------------------------
    // SECURITY CHECK 3: Owner Protection & Demotion Prevention
    // -------------------------------------------------------------
    console.log('\n  [Security Audit 3: Organization Owner Protection]');
    const ownerAMembership = await CompanyMember.findOne({ companyId: companyA._id, userId: ownerA._id });
    const demoteRes = await makeRequest(
      server,
      `/api/v1/companies/${companyA._id}/members/${ownerAMembership?._id}`,
      'PATCH',
      { role: 'recruiter' },
      { Authorization: `Bearer ${tokenOwnerA}` }
    );
    recordResult(
      'Owner Governance',
      'Demotion of single remaining active owner is blocked',
      demoteRes.status === 400,
      400,
      demoteRes.status
    );

    const deleteOwnerRes = await makeRequest(
      server,
      `/api/v1/companies/${companyA._id}/members/${ownerAMembership?._id}`,
      'DELETE',
      undefined,
      { Authorization: `Bearer ${tokenOwnerA}` }
    );
    recordResult(
      'Owner Governance',
      'Removal/revocation of single remaining active owner is blocked',
      deleteOwnerRes.status === 400,
      400,
      deleteOwnerRes.status
    );

    // -------------------------------------------------------------
    // SECURITY CHECK 4: Application Ownership & Candidate Isolation
    // Candidate 2 attempts to view Candidate 1's application
    // -------------------------------------------------------------
    console.log('\n  [Security Audit 4: Application Ownership & Privacy]');
    const viewOtherAppRes = await makeRequest(
      server,
      `/api/v1/applications/${appA1._id}`,
      'GET',
      undefined,
      { Authorization: `Bearer ${tokenCand2}` }
    );
    recordResult(
      'Candidate Isolation',
      'Candidate 2 cannot view Candidate 1 application details',
      viewOtherAppRes.status === 403,
      403,
      viewOtherAppRes.status
    );

    // Candidate 2 attempts to withdraw Candidate 1's application
    const withdrawOtherAppRes = await makeRequest(
      server,
      `/api/v1/applications/${appA1._id}/withdraw`,
      'PATCH',
      undefined,
      { Authorization: `Bearer ${tokenCand2}` }
    );
    recordResult(
      'Candidate Isolation',
      'Candidate 2 cannot withdraw Candidate 1 application',
      withdrawOtherAppRes.status === 403,
      403,
      withdrawOtherAppRes.status
    );

    // -------------------------------------------------------------
    // SECURITY CHECK 5: Duplicate Application Prevention
    // -------------------------------------------------------------
    console.log('\n  [Security Audit 5: Duplicate Application Prevention]');
    const duplicateAppRes = await makeRequest(
      server,
      `/api/v1/jobs/${jobA._id}/applications`,
      'POST',
      { coverLetter: 'Duplicate attempt' },
      { Authorization: `Bearer ${tokenCand1}` }
    );
    recordResult(
      'Application Integrity',
      'Duplicate application for same job & candidate rejected with 409',
      duplicateAppRes.status === 409,
      409,
      duplicateAppRes.status
    );

    // -------------------------------------------------------------
    // SECURITY CHECK 6: Resume Ownership Validation
    // Candidate 1 attempts to submit Candidate 2's resumeId
    // -------------------------------------------------------------
    console.log('\n  [Security Audit 6: Resume Ownership & Verification]');
    const stolenResumeRes = await makeRequest(
      server,
      `/api/v1/jobs/${jobB._id}/applications`,
      'POST',
      { resumeId: resume2._id.toString() },
      { Authorization: `Bearer ${tokenCand1}` }
    );
    recordResult(
      'Resume Security',
      'Submitting another user resumeId rejected with 403 INVALID_RESUME_OWNERSHIP',
      stolenResumeRes.status === 403,
      403,
      stolenResumeRes.status
    );

    // -------------------------------------------------------------
    // SECURITY CHECK 7: Invalid Pipeline State Transitions
    // -------------------------------------------------------------
    console.log('\n  [Security Audit 7: State Machine Integrity]');
    // Current status of appA1 is 'applied'.
    // Direct transition to 'hired' must be rejected
    const invalidJump1 = await makeRequest(
      server,
      `/api/v1/applications/${appA1._id}/status`,
      'PATCH',
      { status: 'hired' },
      { Authorization: `Bearer ${tokenRecA}` }
    );
    recordResult(
      'State Machine',
      'Transition directly from applied -> hired rejected with 400',
      invalidJump1.status === 400,
      400,
      invalidJump1.status
    );

    // Direct transition to 'offered' must be rejected
    const invalidJump2 = await makeRequest(
      server,
      `/api/v1/applications/${appA1._id}/status`,
      'PATCH',
      { status: 'offered' },
      { Authorization: `Bearer ${tokenRecA}` }
    );
    recordResult(
      'State Machine',
      'Transition directly from applied -> offered rejected with 400',
      invalidJump2.status === 400,
      400,
      invalidJump2.status
    );

    // -------------------------------------------------------------
    // SECURITY CHECK 8: Audit Log Integrity & Immutability
    // -------------------------------------------------------------
    console.log('\n  [Security Audit 8: Audit Log Immutability]');
    let auditDeleted = false;
    try {
      await AuditLog.deleteOne({ action: 'JOB_CREATED' });
      auditDeleted = true;
    } catch {
      auditDeleted = false;
    }
    recordResult(
      'Audit Trail',
      'Mongoose middleware prevents deletion of AuditLog records',
      !auditDeleted,
      0,
      auditDeleted ? 1 : 0
    );

    let auditUpdated = false;
    try {
      await AuditLog.updateOne({ action: 'JOB_CREATED' }, { $set: { action: 'MODIFIED_ACTION' } });
      auditUpdated = true;
    } catch {
      auditUpdated = false;
    }
    recordResult(
      'Audit Trail',
      'Mongoose middleware prevents update of AuditLog records',
      !auditUpdated,
      0,
      auditUpdated ? 1 : 0
    );

    // -------------------------------------------------------------
    // SECURITY CHECK 9: Soft Deletion & Archival Behavior
    // -------------------------------------------------------------
    console.log('\n  [Security Audit 9: Soft Deletion & Archival Protection]');
    // Attempt to delete jobA which has active application appA1
    const deleteJobWithApp = await makeRequest(
      server,
      `/api/v1/jobs/${jobA._id}`,
      'DELETE',
      undefined,
      { Authorization: `Bearer ${tokenOwnerA}` }
    );
    const refreshedJobA = await Job.findById(jobA._id);
    recordResult(
      'Archival Safety',
      'Job with applications is soft-closed instead of deleted',
      deleteJobWithApp.status === 200 && refreshedJobA?.status === 'closed',
      200,
      deleteJobWithApp.status
    );

    // Company deletion soft-closes remaining published jobs
    const deleteCompanyRes = await makeRequest(
      server,
      `/api/v1/companies/${companyB._id}`,
      'DELETE',
      undefined,
      { Authorization: `Bearer ${tokenOwnerB}` }
    );
    const refreshedJobB = await Job.findById(jobB._id);
    recordResult(
      'Archival Safety',
      'Company archival automatically soft-closes active published jobs',
      deleteCompanyRes.status === 200 && refreshedJobB?.status === 'closed',
      200,
      deleteCompanyRes.status
    );

    // -------------------------------------------------------------
    // TEARDOWN
    // -------------------------------------------------------------
    console.log('\n3. Cleaning up Test Artifacts...');
    await Application.deleteMany({ _id: appA1._id });
    await Resume.deleteMany({ _id: { $in: [resume1._id, resume2._id] } });
    await CandidateProfile.deleteMany({ userId: { $in: [candidate1._id, candidate2._id] } });
    await Job.deleteMany({ _id: { $in: [jobA._id, jobB._id] } });
    await CompanyMember.deleteMany({ companyId: { $in: [companyA._id, companyB._id] } });
    await Company.deleteMany({ _id: { $in: [companyA._id, companyB._id] } });
    await User.deleteMany({ _id: { $in: [ownerA._id, recruiterA._id, ownerB._id, recruiterB._id, candidate1._id, candidate2._id] } });

    await disconnectDatabase();
    console.log('  ✓ [Teardown] All security audit entities cleanly removed from MongoDB Atlas.');

  } catch (err: any) {
    console.error('Security audit fatal error:', err);
    recordResult('Fatal', `Audit execution failed: ${err.message}`, false, 200, 500);
  } finally {
    if (server) server.close();
  }

  // Summary
  const total = auditResults.length;
  const passed = auditResults.filter((r) => r.passed).length;
  const failed = auditResults.filter((r) => !r.passed).length;

  console.log('\n=============================================================');
  console.log(`   SECURITY AUDIT TOTAL: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('=============================================================\n');

  if (failed > 0) process.exit(1);
  else process.exit(0);
}

runSecurityVerification();
