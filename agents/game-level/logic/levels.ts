import { prisma } from '@/core/db/prisma'

export interface LevelWithProgress {
  id: string
  levelNumber: number
  title: string
  description: string
  isPublished: boolean
  isUnlocked: boolean
  progress: {
    status: string
    complianceScore: number
    gmvScore: number
    uxScore: number
    clearedAt: Date | null
  } | null
}

export async function getLevelsWithProgress(userId: string): Promise<LevelWithProgress[]> {
  const levels = await prisma.level.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      userProgress: {
        where: { userId },
        take: 1,
      },
    },
  })

  const result: LevelWithProgress[] = []

  for (const level of levels) {
    const progress = level.userProgress[0] ?? null
    const isUnlocked = await isLevelUnlockedForUser(userId, level.levelNumber)

    result.push({
      id: level.id,
      levelNumber: level.levelNumber,
      title: level.title,
      description: level.description,
      isPublished: level.isPublished,
      isUnlocked,
      progress: progress
        ? {
            status: progress.status,
            complianceScore: progress.complianceScore,
            gmvScore: progress.gmvScore,
            uxScore: progress.uxScore,
            clearedAt: progress.clearedAt,
          }
        : null,
    })
  }

  return result
}

export async function isLevelUnlockedForUser(
  userId: string,
  levelNumber: number,
): Promise<boolean> {
  if (levelNumber === 1) return true

  const prevLevel = await prisma.level.findUnique({
    where: { levelNumber: levelNumber - 1 },
    select: { id: true },
  })
  if (!prevLevel) return false

  const prevProgress = await prisma.userProgress.findUnique({
    where: { userId_levelId: { userId, levelId: prevLevel.id } },
    select: { status: true },
  })

  return prevProgress?.status === 'cleared'
}
