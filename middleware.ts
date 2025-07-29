import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/registro',
  '/esqueceu-senha',
  '/_next', // Next.js assets
  '/api', // API routes
  '/favicon.ico',
  '/manifest.json',
];

// Define admin-only routes
const adminRoutes = [
  '/usuarios',
  '/configuracoes',
];

// Define routes that require authentication
const protectedRoutes = [
  '/',
  '/busca',
  '/documentos',
  '/chat',
  '/upload',
  '/perfil',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get token from cookies or headers
  const token = request.cookies.get('prefeitura_auth_token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '');

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) => 
    pathname === route || pathname.startsWith(route)
  );

  const isAdminRoute = adminRoutes.some((route) => 
    pathname === route || pathname.startsWith(route)
  );

  // Redirect to login if no token and accessing protected route
  if (!token && (isProtectedRoute || isAdminRoute)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If we have a token, we can let the client-side auth handle role-based access
  // The server can't decode JWT without the secret, so we rely on client-side checks
  
  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (token && ['/login', '/registro'].includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
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
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
};