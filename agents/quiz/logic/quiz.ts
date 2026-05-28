import { prisma } from '@/core/db/prisma'
import { isLevelUnlockedForUser } from '@agents/game-level/logic/levels'

export interface QuizOption {
  id: string
  text: string
}

export interface QuizQuestion {
  id: string
  question: string
  type: string
  sortOrder: number
  options: QuizOption[]
}

export interface QuizSetup {
  levelId: string
  levelNumber: number
  title: string
  questions: QuizQuestion[]
}

export async function getQuizSetup(
  userId: string,
  levelNumber: number,
): Promise<QuizSetup | null> {
  const module = await prisma.module.findUnique({
    where: { levelNumber },
    select: { id: true, levelNumber: true, title: true },
  })
  if (!module) return null

  const unlocked = await isLevelUnlockedForUser(userId, levelNumber)
  if (!unlocked) return null

  const questions = await getQuestionsForLevel(module.id)

  return {
    levelId: module.id,
    levelNumber: module.levelNumber,
    title: module.title,
    questions,
  }
}

export async function getQuestionsForLevel(levelId: string): Promise<QuizQuestion[]> {
  const rows = await prisma.quiz.findMany({
    where: { moduleId: levelId },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      question: true,
      type: true,
      sortOrder: true,
      options: {
        select: {
          id: true,
          text: true,
          // isCorrect / deltas は意図的に除外（クライアント改ざん防止）
        },
      },
    },
  })
  return rows
}
