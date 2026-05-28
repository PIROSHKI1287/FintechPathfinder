import { prisma } from '@/core/db/prisma'

export interface AttemptEntry {
  id: string
  answeredAt: string
  questionText: string
  chosenChoiceText: string | null
  isCorrect: boolean | null
  complianceAfter: number
  gmvAfter: number
  uxAfter: number
  levelNumber: number
  levelTitle: string
}

export interface HistoryByLevel {
  levelNumber: number
  levelTitle: string
  attempts: AttemptEntry[]
}

export async function getQuizHistory(userId: string): Promise<HistoryByLevel[]> {
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId },
    include: {
      question: {
        select: {
          question: true,
          options: { select: { id: true, text: true, isCorrect: true } },
          module: { select: { levelNumber: true, title: true } },
        },
      },
    },
    orderBy: { answeredAt: 'desc' },
  })

  const grouped = new Map<number, HistoryByLevel>()

  for (const a of attempts) {
    const { levelNumber, title } = a.question.module
    const chosenOption = a.chosenChoiceId
      ? a.question.options.find((c) => c.id === a.chosenChoiceId) ?? null
      : null

    const entry: AttemptEntry = {
      id: a.id,
      answeredAt: a.answeredAt.toISOString(),
      questionText: a.question.question,
      chosenChoiceText: chosenOption?.text ?? null,
      isCorrect: chosenOption?.isCorrect ?? null,
      complianceAfter: a.complianceAfter,
      gmvAfter: a.gmvAfter,
      uxAfter: a.uxAfter,
      levelNumber,
      levelTitle: title,
    }

    if (!grouped.has(levelNumber)) {
      grouped.set(levelNumber, { levelNumber, levelTitle: title, attempts: [] })
    }
    grouped.get(levelNumber)!.attempts.push(entry)
  }

  return Array.from(grouped.values()).sort((a, b) => a.levelNumber - b.levelNumber)
}
