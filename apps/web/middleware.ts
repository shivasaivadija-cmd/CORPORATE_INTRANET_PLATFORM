import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/register', '/'];
const protectedRoutes = [
  '/dashboard',
  '/feed',
  '/announcements',
  '/knowledge',
  '/documents',
  '/people',
  '/recognition',
  '/events',
  '/search',
  '/ai-assistant',
  '/admin',
  '/admin-dashboard',
  '/employee-dashboard',
  '/gallery',
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get auth token from cookies (localStorage is stored as cookie by zustand persist)
  const token = request.cookies.get('auth-storage')?.value;
  let isAuthenticated = false;
  let userRole = null;

  if (token) {
    try {
      const authData = JSON.parse(token);
      isAuthenticated = !!authData.state?.accessToken;
      userRole = authData.state?.user?.role;
    } catch {
      isAuthenticated = false;
    }
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isLoginPage = pathname === '/login';
  const isRegisterPage = pathname === '/register';
  const isRootPage = pathname === '/';

  // If not authenticated and trying to access protected route, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If authenticated and on login/register page, redirect to appropriate dashboard
  if (isAuthenticated && (isLoginPage || isRegisterPage)) {
    if (userRole === 'TENANT_ADMIN' || userRole === 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/admin-dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/employee-dashboard', request.url));
  }

  // If on root page
  if (isRootPage) {
    if (isAuthenticated) {
      if (userRole === 'TENANT_ADMIN' || userRole === 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin-dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/employee-dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
