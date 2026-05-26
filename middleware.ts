import { auth } from '@/core/auth/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PATHS = ['/home', '/game', '/dictionary', '/history', '/settings']
const ADMIN_PATHS = ['/admin']
// /game 配下は同意 cookie も必須
const CONSENT_REQUIRED_PATHS = ['/game']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await auth()

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))
  const isAdmin = ADMIN_PATHS.some((p) => pathname.startsWith(p))

  if ((isProtected || isAdmin) && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAdmin && (session?.user as { role?: string })?.role !== 'admin') {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  const needsConsent = CONSENT_REQUIRED_PATHS.some((p) => pathname.startsWith(p))
  if (needsConsent && session) {
    const consent = request.cookies.get('bpsp_consent')?.value
    if (consent !== '1') {
      return NextResponse.redirect(new URL('/home', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|login|register).*)'],
}
