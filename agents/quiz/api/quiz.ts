import { NextResponse } from 'next/server'
import { auth } from '@/core/auth/auth'
import { getQuestionsForLevel } from '@agents/quiz/logic/quiz'
import { isLevelUnlockedForUser } from '@agents/game-level/logic/levels'
import { prisma } from '@/core/db/prisma'

export async function handleGetQuiz(levelId: string): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const level = await prisma.level.findUnique({
    where: { id: levelId },
    select: { levelNumber: true },
  })
  if (!level) {
    return NextResponse.json({ error: 'レベルが見つかりません' }, { status: 404 })
  }

  const unlocked = await isLevelUnlockedForUser(session.user.id, level.levelNumber)
  if (!unlocked) {
    return NextResponse.json({ error: 'このレベルにアクセスする権限がありません' }, { status: 403 })
  }

  const questions = await getQuestionsForLevel(levelId)
  return NextResponse.json({ questions })
}
