/**
 * TALENTFLOW — Centralized Route Classification & Authorization Engine
 * Defines route permissions, safe redirect validation, and role-based access rules.
 */

export type UserRole = 'recruiter' | 'candidate' | 'admin';

export const PUBLIC_ROUTES: string[] = [
  '/',
  '/pricing',
  '/browse-jobs',
  '/jobs',
  '/companies',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/login',
  '/register',
  '/forgot-password',
  '/verify-email',
  '/403',
  '/not-found',
];

export const PUBLIC_ROUTE_PATTERNS: RegExp[] = [
  /^\/jobs\/[^/]+$/,            // /jobs/[id] or /jobs/[slug]
  /^\/verify-email\/[^/]+$/,    // /verify-email/[token]
  /^\/auth\/verify-email.*$/,   // /auth/verify-email
];

export const RECRUITER_ROUTES_PREFIX = '/recruiter';
export const CANDIDATE_ROUTES_PREFIX = '/candidate';
export const ADMIN_ROUTES_PREFIX = '/admin';

/**
 * Determines whether a given pathname is classified as a public route.
 */
export function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) {
    return true;
  }
  for (const pattern of PUBLIC_ROUTE_PATTERNS) {
    if (pattern.test(pathname)) {
      return true;
    }
  }
  return false;
}

/**
 * Returns the required role for a given protected path, or null if public.
 */
export function getRequiredRoleForPath(pathname: string): UserRole | null {
  if (pathname.startsWith(ADMIN_ROUTES_PREFIX)) {
    return 'admin';
  }
  if (pathname.startsWith(RECRUITER_ROUTES_PREFIX)) {
    return 'recruiter';
  }
  if (pathname.startsWith(CANDIDATE_ROUTES_PREFIX)) {
    return 'candidate';
  }
  return null;
}

/**
 * Checks if a user with a given role is authorized to access a pathname.
 */
export function isRouteAllowedForRole(pathname: string, userRole: UserRole | null | undefined): boolean {
  const requiredRole = getRequiredRoleForPath(pathname);
  if (!requiredRole) {
    return true; // Public route
  }
  if (!userRole) {
    return false; // Protected route requires an authenticated role
  }
  return userRole === requiredRole;
}

/**
 * Returns the default authorized dashboard path for a given role.
 */
export function getDefaultDashboardForRole(role: UserRole | null | undefined): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'recruiter':
      return '/recruiter/dashboard';
    case 'candidate':
      return '/candidate/dashboard';
    default:
      return '/auth/login';
  }
}

/**
 * Sanitizes and validates redirect URLs to prevent Open Redirect vulnerabilities.
 * 
 * Rules:
 * 1. Must start with a single '/'
 * 2. Must NOT start with '//' (protocol-relative URL)
 * 3. Must NOT start with '/\' or '\' (Windows path tricks)
 * 4. Must NOT contain URI scheme indicators like 'http:', 'https:', 'javascript:', 'data:'
 * 5. Must NOT contain CR, LF, or tab characters (header injection protection)
 */
export function getSafeRedirectUrl(nextUrl: string | null | undefined, defaultUrl: string = '/'): string {
  if (!nextUrl || typeof nextUrl !== 'string') {
    return defaultUrl;
  }

  const trimmed = nextUrl.trim();

  // Basic structure check
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\') || trimmed.startsWith('\\')) {
    return defaultUrl;
  }

  // Scheme/protocol check (e.g., https:, javascript:, data:)
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return defaultUrl;
  }

  // Disallow control characters
  if (/[\r\n\t\0]/.test(trimmed)) {
    return defaultUrl;
  }

  return trimmed;
}

/**
 * Helper to parse cookies string (useful in Next.js Edge Runtime).
 */
export function parseCookieValue(cookieHeader: string | null | undefined, key: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${key}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
