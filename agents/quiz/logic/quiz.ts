import { prisma } from '@/core/db/prisma'
import { isLevelUnlockedForUser } from '@agents/game-level/logic/levels'

export interface QuizChoice {
  id: string
  choiceText: string
}

export interface QuizQuestion {
  id: string
  questionText: string
  type: string
  sortOrder: number
  choices: QuizChoice[]
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
  const level = await prisma.level.findUnique({
    where: { levelNumber },
    select: { id: true, levelNumber: true, title: true },
  })
  if (!level) return null

  const unlocked = await isLevelUnlockedForUser(userId, levelNumber)
  if (!unlocked) return null

  const questions = await getQuestionsForLevel(level.id)

  return {
    levelId: level.id,
    levelNumber: level.levelNumber,
    title: level.title,
    questions,
  }
}

export async function getQuestionsForLevel(levelId: string): Promise<QuizQuestion[]> {
  const rows = await prisma.quizQuestion.findMany({
    where: { levelId },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      questionText: true,
      type: true,
      sortOrder: true,
      choices: {
        select: {
          id: true,
          choiceText: true,
          // isCorrect / deltas は意図的に除外（クライアント改ざん防止）
        },
      },
    },
  })
  return rows
}
