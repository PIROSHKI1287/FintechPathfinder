import { auth } from '@/core/auth/auth'
import { NextResponse } from 'next/server'

export async function requireAdmin(): Promise<string | NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }
  if ((session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: '管理者権限が必要です' }, { status: 403 })
  }
  return session.user.id
}
