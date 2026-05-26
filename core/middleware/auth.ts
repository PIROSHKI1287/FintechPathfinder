import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/core/auth/auth'

const PROTECTED_PATHS = ['/home', '/game', '/dictionary', '/history', '/settings']
const ADMIN_PATHS = ['/admin']

export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await auth()

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  const isAdmin = ADMIN_PATHS.some((path) => pathname.startsWith(path))

  if ((isProtected || isAdmin) && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAdmin && (session?.user as { role?: string })?.role !== 'admin') {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}
