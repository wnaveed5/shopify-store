import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if user has access
  const hasAccess = request.cookies.get('storeAccess')?.value === 'granted';
  
  // Allow access to password page and public assets
  if (request.nextUrl.pathname === '/password' || 
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // Redirect to password page if no access
  if (!hasAccess) {
    return NextResponse.redirect(new URL('/password', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
