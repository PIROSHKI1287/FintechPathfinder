export { auth as middleware } from '@/core/auth/auth'

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login|register).*)',
    '/',
  ],
}
