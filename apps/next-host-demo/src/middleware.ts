import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, isTokenExpired } from './lib/auth/jwt';

// Routes that require authentication
const protectedRoutes = [
  '/api/claims',
  '/api/quotes',
  '/api/prospects',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Security: Block x-middleware-subrequest header (CVE-2025-29927)
  if (request.headers.get('x-middleware-subrequest')) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }

  // Check if route requires authentication
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected && request.method !== 'GET') {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = await verifyToken(token);

    if (!payload || isTokenExpired(payload)) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Token is valid, continue
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/claims/:path*',
    '/api/quotes/:path*',
    '/api/prospects/:path*',
  ],
};
