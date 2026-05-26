import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/core/auth/auth'
import { getUserProgress, saveOrUpdateProgress } from '@agents/game-level/logic/progress'
import { saveProgressSchema } from '@/core/utils/schemas'

export async function handleGetProgress(): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const progress = await getUserProgress(session.user.id)
  return NextResponse.json({ progress })
}

export async function handleSaveProgress(request: NextRequest): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = saveProgressSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'バリデーションエラー' },
      { status: 400 },
    )
  }

  await saveOrUpdateProgress(session.user.id, parsed.data)
  return NextResponse.json({ message: '進行状況を保存しました' })
}
