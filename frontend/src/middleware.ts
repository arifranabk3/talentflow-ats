import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  isPublicRoute,
  getRequiredRoleForPath,
  getDefaultDashboardForRole,
  getSafeRedirectUrl,
  UserRole,
} from './utils/authRoutes';

/**
 * Extracts and decodes JWT payload in standard Edge Runtime environments.
 */
function decodeJwtPayload(token: string): { exp?: number; role?: UserRole } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Static assets & internal routes bypass
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Handle backwards-compatible legacy auth paths
  if (pathname === '/login') {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.search = search;
    return NextResponse.redirect(redirectUrl);
  }
  if (pathname === '/register') {
    const redirectUrl = new URL('/auth/register', request.url);
    redirectUrl.search = search;
    return NextResponse.redirect(redirectUrl);
  }
  if (pathname === '/forgot-password') {
    const redirectUrl = new URL('/auth/forgot-password', request.url);
    redirectUrl.search = search;
    return NextResponse.redirect(redirectUrl);
  }

  // Retrieve auth cookies
  const token =
    request.cookies.get('talentflow_token')?.value ||
    request.cookies.get('token')?.value ||
    null;
  const cookieRole = (request.cookies.get('talentflow_role')?.value as UserRole) || null;

  let isAuthenticated = false;
  let userRole: UserRole | null = cookieRole;

  if (token) {
    const payload = decodeJwtPayload(token);
    if (payload) {
      const nowSeconds = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < nowSeconds) {
        // Expired token
        isAuthenticated = false;
        userRole = null;
      } else {
        isAuthenticated = true;
        userRole = payload.role || cookieRole || 'candidate';
      }
    } else {
      // In standalone demo/preview setups where a mock token string is present
      isAuthenticated = true;
      userRole = cookieRole || 'recruiter';
    }
  }

  const isPublic = isPublicRoute(pathname);
  const requiredRole = getRequiredRoleForPath(pathname);

  // SCENARIO 1: Unauthenticated user attempting to access a protected route
  if (!isAuthenticated && requiredRole) {
    const loginUrl = new URL('/auth/login', request.url);
    const fullOriginalPath = pathname + search;
    loginUrl.searchParams.set('next', fullOriginalPath);
    return NextResponse.redirect(loginUrl);
  }

  // SCENARIO 2: Authenticated user accessing an auth page (login, register)
  const isAuthPage =
    pathname === '/auth/login' ||
    pathname === '/auth/register' ||
    pathname === '/auth/forgot-password';

  if (isAuthenticated && isAuthPage && pathname !== '/auth/forgot-password') {
    const nextParam = request.nextUrl.searchParams.get('next');
    const safeDestination = getSafeRedirectUrl(nextParam, getDefaultDashboardForRole(userRole));
    return NextResponse.redirect(new URL(safeDestination, request.url));
  }

  // SCENARIO 3: Authenticated user accessing a protected route with a role mismatch
  if (isAuthenticated && requiredRole && userRole !== requiredRole) {
    const forbiddenUrl = new URL('/403', request.url);
    forbiddenUrl.searchParams.set('required', requiredRole);
    forbiddenUrl.searchParams.set('role', userRole || 'unknown');
    return NextResponse.redirect(forbiddenUrl);
  }

  // SCENARIO 4: Public route or properly authorized protected route
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (e.g. .svg, .png, .jpg)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
};
