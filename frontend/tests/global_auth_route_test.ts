/**
 * TALENTFLOW — Global Authentication & Route Protection Test Suite
 * Validates all 12 scenarios specified in the Global Auth & Protected Route System specification.
 */

import {
  isPublicRoute,
  getRequiredRoleForPath,
  isRouteAllowedForRole,
  getDefaultDashboardForRole,
  getSafeRedirectUrl,
  UserRole,
} from '../src/utils/authRoutes';
import { NextRequest } from 'next/server';
import { middleware } from '../src/middleware';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
  }
}

// Helper to create simulated NextRequest with cookies
function createMockRequest(url: string, cookies: Record<string, string> = {}): NextRequest {
  const req = new NextRequest(new URL(url, 'http://localhost:3000'));
  for (const [key, val] of Object.entries(cookies)) {
    req.cookies.set(key, val);
  }
  return req;
}

// Helper to generate a test JWT (header.payload.signature)
function createMockJwt(payload: Record<string, any>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = Buffer.from('mock_signature').toString('base64url');
  return `${header}.${body}.${sig}`;
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('TALENTFLOW — GLOBAL AUTHENTICATION & ROUTE SUITE');
  console.log('======================================================\n');

  // SECTION 1: Route Classification & Public Accessibility
  console.log('--- SECTION 1: Route Classification ---');
  assert(isPublicRoute('/'), 'Public route "/" is recognized');
  assert(isPublicRoute('/pricing'), 'Public route "/pricing" is recognized');
  assert(isPublicRoute('/browse-jobs'), 'Public route "/browse-jobs" is recognized');
  assert(isPublicRoute('/jobs'), 'Public route "/jobs" is recognized');
  assert(isPublicRoute('/jobs/job-01'), 'Dynamic public route "/jobs/job-01" is recognized');
  assert(isPublicRoute('/companies'), 'Public route "/companies" is recognized');
  assert(isPublicRoute('/auth/login'), 'Auth public route "/auth/login" is recognized');
  assert(isPublicRoute('/auth/register'), 'Auth public route "/auth/register" is recognized');
  assert(isPublicRoute('/403'), 'Forbidden page "/403" is public');
  assert(!isPublicRoute('/recruiter/dashboard'), 'Recruiter route is not public');
  assert(!isPublicRoute('/candidate/applications'), 'Candidate route is not public');
  assert(!isPublicRoute('/admin/dashboard'), 'Admin route is not public');

  // SECTION 2: Role Authorization Mappings
  console.log('\n--- SECTION 2: Role Authorization Mappings ---');
  assert(getRequiredRoleForPath('/recruiter/dashboard') === 'recruiter', 'Recruiter path requires recruiter');
  assert(getRequiredRoleForPath('/recruiter/jobs/create') === 'recruiter', 'Recruiter job create requires recruiter');
  assert(getRequiredRoleForPath('/candidate/applications') === 'candidate', 'Candidate path requires candidate');
  assert(getRequiredRoleForPath('/candidate/profile') === 'candidate', 'Candidate profile requires candidate');
  assert(getRequiredRoleForPath('/admin/dashboard') === 'admin', 'Admin path requires admin');
  assert(getRequiredRoleForPath('/admin/audit-logs') === 'admin', 'Admin audit-logs requires admin');
  assert(getRequiredRoleForPath('/browse-jobs') === null, 'Public path has null required role');

  assert(isRouteAllowedForRole('/recruiter/jobs', 'recruiter') === true, 'Recruiter allowed on recruiter route');
  assert(isRouteAllowedForRole('/recruiter/jobs', 'candidate') === false, 'Candidate blocked from recruiter route');
  assert(isRouteAllowedForRole('/recruiter/jobs', null) === false, 'Guest blocked from recruiter route');
  assert(isRouteAllowedForRole('/admin/users', 'admin') === true, 'Admin allowed on admin route');
  assert(isRouteAllowedForRole('/admin/users', 'recruiter') === false, 'Recruiter blocked from admin route');

  // SECTION 3: Open Redirect Prevention & Safe Redirect Sanitization
  console.log('\n--- SECTION 3: Open Redirect Prevention ---');
  assert(getSafeRedirectUrl('/recruiter/jobs/create') === '/recruiter/jobs/create', 'Valid internal path accepted');
  assert(getSafeRedirectUrl('/candidate/applications?tab=active') === '/candidate/applications?tab=active', 'Valid path with query accepted');
  assert(getSafeRedirectUrl('https://evil-attacker.com') === '/', 'External HTTPS URL rejected and replaced with fallback');
  assert(getSafeRedirectUrl('http://phishing.site/login') === '/', 'External HTTP URL rejected and replaced with fallback');
  assert(getSafeRedirectUrl('//malicious.com') === '/', 'Protocol-relative URL "//" rejected and replaced with fallback');
  assert(getSafeRedirectUrl('/\\evil.com') === '/', 'Windows backslash bypass "/\\" rejected');
  assert(getSafeRedirectUrl('\\evil.com') === '/', 'Single backslash bypass "\\evil.com" rejected');
  assert(getSafeRedirectUrl('javascript:alert(document.cookie)') === '/', 'Javascript scheme injection rejected');
  assert(getSafeRedirectUrl('data:text/html,<script>alert(1)</script>') === '/', 'Data URI scheme rejected');
  assert(getSafeRedirectUrl('/safe/path\r\nHeader-Injection:true') === '/', 'CRLF header injection rejected');
  assert(getSafeRedirectUrl(null, '/recruiter/dashboard') === '/recruiter/dashboard', 'Null nextUrl uses provided role fallback');

  // SECTION 4: Scenario 1 — Guest opens recruiter dashboard
  console.log('\n--- SECTION 4: Scenario 1 & 3 & 5 (Unauthenticated Access) ---');
  const req1 = createMockRequest('/recruiter/dashboard');
  const res1 = middleware(req1);
  assert(res1.status === 307 || res1.status === 302, 'Guest redirected from /recruiter/dashboard');
  const loc1 = res1.headers.get('location') || '';
  assert(loc1.includes('/auth/login?next='), 'Redirected to /auth/login with next param');
  assert(loc1.includes(encodeURIComponent('/recruiter/dashboard')), 'Preserves requested /recruiter/dashboard path');

  const req2 = createMockRequest('/candidate/applications');
  const res2 = middleware(req2);
  assert(res2.headers.get('location')?.includes(encodeURIComponent('/candidate/applications')) === true, 'Guest redirected from /candidate/applications preserving next param');

  const req3 = createMockRequest('/admin/dashboard');
  const res3 = middleware(req3);
  assert(res3.headers.get('location')?.includes(encodeURIComponent('/admin/dashboard')) === true, 'Guest redirected from /admin/dashboard preserving next param');

  // SECTION 5: Scenario 2 & 4 — Authenticated user accessing auth page with `next`
  console.log('\n--- SECTION 5: Scenario 2 & 4 (Post-Login Return) ---');
  const validRecruiterJwt = createMockJwt({
    userId: 'usr-rec-01',
    role: 'recruiter',
    exp: Math.floor(Date.now() / 1000) + 3600,
  });

  const req4 = createMockRequest('/auth/login?next=%2Frecruiter%2Fjobs%2Fcreate', {
    talentflow_token: validRecruiterJwt,
    talentflow_role: 'recruiter',
  });
  const res4 = middleware(req4);
  assert(res4.headers.get('location')?.endsWith('/recruiter/jobs/create') === true, 'Authenticated recruiter on /auth/login redirected to requested next URL');

  const validCandidateJwt = createMockJwt({
    userId: 'usr-cand-01',
    role: 'candidate',
    exp: Math.floor(Date.now() / 1000) + 3600,
  });
  const req5 = createMockRequest('/auth/login?next=%2Fcandidate%2Fapplications', {
    talentflow_token: validCandidateJwt,
    talentflow_role: 'candidate',
  });
  const res5 = middleware(req5);
  assert(res5.headers.get('location')?.endsWith('/candidate/applications') === true, 'Authenticated candidate on /auth/login redirected to requested next URL');

  // SECTION 6: Scenario 6 — Cross-Role Access Mismatch (403 Forbidden)
  console.log('\n--- SECTION 6: Scenario 6 (Role Authorization 403 Gate) ---');
  const req6 = createMockRequest('/admin/dashboard', {
    talentflow_token: validRecruiterJwt,
    talentflow_role: 'recruiter',
  });
  const res6 = middleware(req6);
  assert(res6.headers.get('location')?.includes('/403') === true, 'Recruiter accessing /admin/dashboard redirected to /403');
  assert(res6.headers.get('location')?.includes('required=admin') === true, '403 URL specifies required=admin');

  const req7 = createMockRequest('/recruiter/dashboard', {
    talentflow_token: validCandidateJwt,
    talentflow_role: 'candidate',
  });
  const res7 = middleware(req7);
  assert(res7.headers.get('location')?.includes('/403') === true, 'Candidate accessing /recruiter/dashboard redirected to /403');
  assert(res7.headers.get('location')?.includes('required=recruiter') === true, '403 URL specifies required=recruiter');

  // SECTION 7: Authorized Access Allowed Through
  console.log('\n--- SECTION 7: Authorized Access Pass-Through ---');
  const validAdminJwt = createMockJwt({
    userId: 'usr-adm-01',
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + 3600,
  });
  const req8 = createMockRequest('/admin/dashboard', {
    talentflow_token: validAdminJwt,
    talentflow_role: 'admin',
  });
  const res8 = middleware(req8);
  assert(res8.headers.get('x-middleware-next') === '1' || res8.status === 200, 'Admin authorized to access /admin/dashboard (passed through)');

  const req9 = createMockRequest('/recruiter/jobs/create', {
    talentflow_token: validRecruiterJwt,
    talentflow_role: 'recruiter',
  });
  const res9 = middleware(req9);
  assert(res9.headers.get('x-middleware-next') === '1' || res9.status === 200, 'Recruiter authorized to access /recruiter/jobs/create (passed through)');

  // SECTION 8: Scenario 10 — Token Expiration
  console.log('\n--- SECTION 8: Scenario 10 (Expired Token Handling) ---');
  const expiredJwt = createMockJwt({
    userId: 'usr-rec-01',
    role: 'recruiter',
    exp: Math.floor(Date.now() / 1000) - 300, // Expired 5 minutes ago
  });
  const req10 = createMockRequest('/recruiter/dashboard', {
    talentflow_token: expiredJwt,
    talentflow_role: 'recruiter',
  });
  const res10 = middleware(req10);
  assert(res10.headers.get('location')?.includes('/auth/login') === true, 'Expired session token detected and redirected to /auth/login');

  // SECTION 9: Scenario 11 — Malicious Next Parameter Sanitization
  console.log('\n--- SECTION 9: Scenario 11 (Malicious Next Parameter Sanitization) ---');
  const req11 = createMockRequest('/auth/login?next=https%3A%2F%2Fattacker.example.com', {
    talentflow_token: validRecruiterJwt,
    talentflow_role: 'recruiter',
  });
  const res11 = middleware(req11);
  assert(!res11.headers.get('location')?.includes('attacker.example.com'), 'Malicious next param not present in redirect URL');
  assert(res11.headers.get('location')?.endsWith('/recruiter/dashboard') === true, 'Fell back safely to role default dashboard');

  // SECTION 10: Legacy /login and /register route rewrites
  console.log('\n--- SECTION 10: Legacy Route Rewrites ---');
  const req12 = createMockRequest('/login');
  const res12 = middleware(req12);
  assert(res12.headers.get('location')?.includes('/auth/login') === true, 'Legacy /login redirects to /auth/login');

  const req13 = createMockRequest('/register?next=%2Frecruiter%2Fjobs');
  const res13 = middleware(req13);
  assert(res13.headers.get('location')?.includes('/auth/register?next=') === true, 'Legacy /register redirects to /auth/register preserving next');

  console.log('\n======================================================');
  console.log(`TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log('======================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
