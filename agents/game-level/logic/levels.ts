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
  const modules = await prisma.module.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      userProgress: {
        where: { userId },
        take: 1,
      },
    },
  })

  const result: LevelWithProgress[] = []

  for (const module of modules) {
    const progress = module.userProgress[0] ?? null
    const isUnlocked = await isLevelUnlockedForUser(userId, module.levelNumber)

    result.push({
      id: module.id,
      levelNumber: module.levelNumber,
      title: module.title,
      description: module.description,
      isPublished: module.isPublished,
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

  const prevModule = await prisma.module.findUnique({
    where: { levelNumber: levelNumber - 1 },
    select: { id: true },
  })
  if (!prevModule) return false

  const prevProgress = await prisma.userProgress.findUnique({
    where: { userId_moduleId: { userId, moduleId: prevModule.id } },
    select: { status: true },
  })

  return prevProgress?.status === 'cleared'
}
