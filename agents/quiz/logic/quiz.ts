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

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
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

  // Fisher-Yates shuffle: both question order and options within each question
  return shuffle(rows).map((q) => ({ ...q, options: shuffle(q.options) }))
}
