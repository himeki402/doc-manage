import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePaths = ['/me'] 
const adminPaths = ['/admin']
const authPaths = ['/login', '/register']
const dashboardEditRegex = /^\/dashboard\/(?!edit).*/ // Regex to match all paths except /dashboard/edit
const adminEditRegex = /^\/admin\/(?!edit).*/ // Regex to match all paths except /admin/edit

export default async function middleware(request: NextRequest) {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('Authentication')
  const { pathname } = request.nextUrl
  // Chưa đăng nhập thì không cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  // Đăng nhập rồi thì không cho vào login/register nữa
  if (authPaths.some((path) => pathname.startsWith(path)) && sessionToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  if (pathname.match(dashboardEditRegex) && !sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/me', '/login', '/register', '/dashboard/:path*', '/admin/:path*'] 
}