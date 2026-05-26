import { NextResponse } from 'next/server'
import { auth } from '@/core/auth/auth'
import { getLevelsWithProgress } from '@agents/game-level/logic/levels'

export async function handleGetLevels(): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const levels = await getLevelsWithProgress(session.user.id)
  return NextResponse.json({ levels })
}
