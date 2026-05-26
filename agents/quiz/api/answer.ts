import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/core/auth/auth'
import { processAnswer } from '@agents/quiz/logic/answer'
import { quizAnswerSchema } from '@/core/utils/schemas'

export async function handleSubmitAnswer(request: NextRequest): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = quizAnswerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'バリデーションエラー' },
      { status: 400 },
    )
  }

  const result = await processAnswer(
    session.user.id,
    parsed.data.questionId,
    parsed.data.chosenChoiceId,
    parsed.data.levelId,
  )

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json(result)
}
