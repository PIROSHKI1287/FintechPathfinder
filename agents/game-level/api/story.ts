import { NextResponse } from 'next/server'
import { auth } from '@/core/auth/auth'
import { getLevelStoryById } from '@agents/game-level/logic/story'

export async function handleGetStory(levelId: string): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const data = await getLevelStoryById(session.user.id, levelId)
  if (!data) {
    return NextResponse.json({ error: 'レベルが見つからないか、アクセス権がありません' }, { status: 404 })
  }

  return NextResponse.json({ pages: data.pages, total: data.pages.length })
}
