import { NextResponse } from 'next/server'
import { auth } from '@/core/auth/auth'
import { getQuizHistory } from '@agents/game-level/logic/history'

export async function handleGetHistory(): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }
  const history = await getQuizHistory(session.user.id)
  return NextResponse.json({ history })
}
