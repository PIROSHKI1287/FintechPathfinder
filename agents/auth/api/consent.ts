import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/core/auth/auth'
import { recordConsent } from '@agents/auth/logic/consent'

export async function handleConsent(request: NextRequest): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    undefined

  await recordConsent(session.user.id, ip)

  const res = NextResponse.json({ message: '同意を記録しました' })
  res.cookies.set('bpsp_consent', '1', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    // セッション cookie（maxAge 未設定でブラウザ終了時に削除）
  })
  return res
}
