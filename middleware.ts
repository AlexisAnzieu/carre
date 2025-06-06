import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/clairiere-obscure/admin')) {
    const authCookie = request.cookies.get('admin-auth');
    
    // Skip auth check for login page and API routes
    if (
      request.nextUrl.pathname === '/clairiere-obscure/admin/login' ||
      request.nextUrl.pathname.startsWith('/clairiere-obscure/api/auth')
    ) {
      return NextResponse.next();
    }

    // If no auth cookie is present, or it's not valid, redirect to login
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.redirect(new URL('/clairiere-obscure/admin/login', request.url));
    }

    // User is authenticated, allow access to admin routes
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/clairiere-obscure/admin/:path*',
  ],
}
