import { prisma } from '@/core/db/prisma'
import { getProgressForLevel, saveOrUpdateProgress } from '@agents/game-level/logic/progress'

export interface AnswerResult {
  isCorrect: boolean
  feedbackText: string | null
  params: { compliance: number; gmv: number; ux: number }
  isGameOver: boolean
  isLevelCleared: boolean
  answeredCount: number
  totalCount: number
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val))
}

export async function processAnswer(
  userId: string,
  questionId: string,
  chosenChoiceId: string,
  levelId: string,
): Promise<AnswerResult | { error: string; status: number }> {
  // 問題がこのレベルに属するか検証
  const question = await prisma.quiz.findUnique({
    where: { id: questionId },
    select: { moduleId: true },
  })
  if (!question || question.moduleId !== levelId) {
    return { error: '問題が見つかりません', status: 404 }
  }

  // 選択肢がこの問題に属するか検証（isCorrect・deltas を取得）
  const choice = await prisma.quizOption.findUnique({
    where: { id: chosenChoiceId },
    select: {
      quizId: true,
      isCorrect: true,
      feedbackText: true,
      complianceDelta: true,
      gmvDelta: true,
      uxDelta: true,
    },
  })
  if (!choice || choice.quizId !== questionId) {
    return { error: '選択肢が見つかりません', status: 404 }
  }

  // 現在パラメータ取得（未記録なら初期値）
  const current = await getProgressForLevel(userId, levelId)
  const compliance = current?.complianceScore ?? 100
  const gmv = current?.gmvScore ?? 0
  const ux = current?.uxScore ?? 100

  // デルタ適用 + クランプ
  const newCompliance = clamp(compliance + choice.complianceDelta, 0, 100)
  const newGmv = Math.max(0, gmv + choice.gmvDelta)
  const newUx = clamp(ux + choice.uxDelta, 0, 100)

  const isGameOver = newCompliance === 0

  // QuizAttempt 保存
  await prisma.quizAttempt.create({
    data: {
      userId,
      questionId,
      chosenChoiceId,
      complianceAfter: newCompliance,
      gmvAfter: newGmv,
      uxAfter: newUx,
    },
  })

  // 全問回答チェック
  const totalCount = await prisma.quiz.count({ where: { moduleId: levelId } })
  const answeredRows = await prisma.quizAttempt.findMany({
    where: { userId, question: { moduleId: levelId } },
    select: { questionId: true },
    distinct: ['questionId'],
  })
  const answeredCount = answeredRows.length
  const isLevelCleared = !isGameOver && answeredCount >= totalCount && totalCount > 0

  // UserProgress 更新（game-level エージェントの関数経由）
  const newStatus = isGameOver ? 'game_over' : isLevelCleared ? 'cleared' : 'in_progress'
  await saveOrUpdateProgress(userId, {
    levelId,
    status: newStatus,
    complianceScore: newCompliance,
    gmvScore: newGmv,
    uxScore: newUx,
  })

  return {
    isCorrect: choice.isCorrect,
    feedbackText: choice.feedbackText,
    params: { compliance: newCompliance, gmv: newGmv, ux: newUx },
    isGameOver,
    isLevelCleared,
    answeredCount,
    totalCount,
  }
}
