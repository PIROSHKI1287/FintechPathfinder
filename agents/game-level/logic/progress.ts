import { prisma } from '@/core/db/prisma'

export interface ProgressEntry {
  levelId: string
  levelNumber: number
  title: string
  status: string
  complianceScore: number
  gmvScore: number
  uxScore: number
  clearedAt: Date | null
}

export async function getUserProgress(userId: string): Promise<ProgressEntry[]> {
  const rows = await prisma.userProgress.findMany({
    where: { userId },
    include: { level: { select: { levelNumber: true, title: true } } },
    orderBy: { level: { levelNumber: 'asc' } },
  })

  return rows.map((r) => ({
    levelId: r.levelId,
    levelNumber: r.level.levelNumber,
    title: r.level.title,
    status: r.status,
    complianceScore: r.complianceScore,
    gmvScore: r.gmvScore,
    uxScore: r.uxScore,
    clearedAt: r.clearedAt,
  }))
}

export interface CurrentParams {
  status: string
  complianceScore: number
  gmvScore: number
  uxScore: number
}

export async function getProgressForLevel(
  userId: string,
  levelId: string,
): Promise<CurrentParams | null> {
  const row = await prisma.userProgress.findUnique({
    where: { userId_levelId: { userId, levelId } },
    select: { status: true, complianceScore: true, gmvScore: true, uxScore: true },
  })
  return row
}

export interface SaveProgressInput {
  levelId: string
  status: 'in_progress' | 'cleared' | 'game_over'
  complianceScore: number
  gmvScore: number
  uxScore: number
}

export async function saveOrUpdateProgress(
  userId: string,
  input: SaveProgressInput,
): Promise<void> {
  const data = {
    status: input.status,
    complianceScore: input.complianceScore,
    gmvScore: input.gmvScore,
    uxScore: input.uxScore,
    clearedAt: input.status === 'cleared' ? new Date() : undefined,
  }

  await prisma.userProgress.upsert({
    where: { userId_levelId: { userId, levelId: input.levelId } },
    create: { userId, levelId: input.levelId, ...data },
    update: data,
  })
}
