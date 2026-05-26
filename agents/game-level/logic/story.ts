import { prisma } from '@/core/db/prisma'
import { isLevelUnlockedForUser } from './levels'

export interface StoryPage {
  id: string
  pageNumber: number
  contentJson: unknown
  diagramUrl: string | null
}

export interface LevelStory {
  levelId: string
  levelNumber: number
  title: string
  pages: StoryPage[]
}

export async function getLevelStory(
  userId: string,
  levelNumber: number,
): Promise<LevelStory | null> {
  const level = await prisma.level.findUnique({
    where: { levelNumber },
    include: {
      storyPages: { orderBy: { pageNumber: 'asc' } },
    },
  })

  if (!level) return null

  const unlocked = await isLevelUnlockedForUser(userId, levelNumber)
  if (!unlocked) return null

  return {
    levelId: level.id,
    levelNumber: level.levelNumber,
    title: level.title,
    pages: level.storyPages.map((p) => ({
      id: p.id,
      pageNumber: p.pageNumber,
      contentJson: p.contentJson,
      diagramUrl: p.diagramUrl,
    })),
  }
}

export async function getLevelStoryById(
  userId: string,
  levelId: string,
): Promise<LevelStory | null> {
  const level = await prisma.level.findUnique({
    where: { id: levelId },
    include: { storyPages: { orderBy: { pageNumber: 'asc' } } },
  })
  if (!level) return null

  const unlocked = await isLevelUnlockedForUser(userId, level.levelNumber)
  if (!unlocked) return null

  return {
    levelId: level.id,
    levelNumber: level.levelNumber,
    title: level.title,
    pages: level.storyPages.map((p) => ({
      id: p.id,
      pageNumber: p.pageNumber,
      contentJson: p.contentJson,
      diagramUrl: p.diagramUrl,
    })),
  }
}
