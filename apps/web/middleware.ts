import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const roleRoutes = {
  admin: ["/admin", "/dashboard"],
  user: ["/user", "/documents"],
  public: ["/", "/login", "/register"],
};

const publicPaths = ['/', '/category', '/doc']
const protectedPaths = ['/me', '/dashboard', '/admin']
const authPaths = ['/login', '/register']

export default async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('Authentication')
  console.log('Session Token:', sessionToken)
  const { pathname } = request.nextUrl
  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )

  console.log('NextResponse:', NextResponse.next().cookies)
  if (pathname.startsWith('/api') || pathname === '/') {
    return NextResponse.next();
  }

  // Check if the current path is an auth path
  const isAuthPath = authPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )

  // Check if the current path requires authentication
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )

  // Special case for dashboard/edit which might be public
  const isDashboardEditPath = pathname === '/dashboard/edit'
  
  // Special case for admin/edit which might be public
  const isAdminEditPath = pathname === '/admin/edit'

  // Case 1: User is authenticated and tries to access auth pages
  if (isAuthPath && sessionToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Case 2: User is not authenticated and tries to access protected paths
  if (!sessionToken && (
    isProtectedPath && 
    !isDashboardEditPath && 
    !isAdminEditPath
  )) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Allow all other cases to proceed
  return NextResponse.next()
}

export const config = {
  // Matcher for all routes that need middleware processing
  matcher: [
    // Include public paths
    '/',
    '/category/:path*',
    '/doc/:path*',
    
    // Include protected paths
    '/me/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    
    // Include auth paths
    '/login',
    '/register'
  ]
}