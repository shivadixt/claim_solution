import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';

    const backendRes = await fetch(`${apiBaseUrl}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!backendRes.ok) {
      const loginUrl = new URL('/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      // Clean up invalid session cookie
      response.cookies.delete('session_token');
      return response;
    }

    const userData = await backendRes.json();
    const pathname = request.nextUrl.pathname;

    // Role-specific protection for /client/* routes
    if (pathname.startsWith('/client') && userData.role !== 'CLIENT_ADMIN') {
      if (userData.role === 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      if (userData.role === 'OPERATIONS_ADMIN') {
        return NextResponse.redirect(new URL('/ops', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Role-specific protection for /ops/* routes
    if (
      pathname.startsWith('/ops') &&
      userData.role !== 'OPERATIONS_ADMIN' &&
      userData.role !== 'SUPER_ADMIN'
    ) {
      if (userData.role === 'CLIENT_ADMIN') {
        return NextResponse.redirect(new URL('/client', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware auth verification error:', error);
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*', '/client/:path*', '/ops/:path*'],
};
