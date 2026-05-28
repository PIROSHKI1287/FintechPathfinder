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
  const module = await prisma.module.findUnique({
    where: { levelNumber },
    include: {
      storyPages: { orderBy: { pageNumber: 'asc' } },
    },
  })

  if (!module) return null

  const unlocked = await isLevelUnlockedForUser(userId, levelNumber)
  if (!unlocked) return null

  return {
    levelId: module.id,
    levelNumber: module.levelNumber,
    title: module.title,
    pages: module.storyPages.map((p) => ({
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
  const module = await prisma.module.findUnique({
    where: { id: levelId },
    include: { storyPages: { orderBy: { pageNumber: 'asc' } } },
  })
  if (!module) return null

  const unlocked = await isLevelUnlockedForUser(userId, module.levelNumber)
  if (!unlocked) return null

  return {
    levelId: module.id,
    levelNumber: module.levelNumber,
    title: module.title,
    pages: module.storyPages.map((p) => ({
      id: p.id,
      pageNumber: p.pageNumber,
      contentJson: p.contentJson,
      diagramUrl: p.diagramUrl,
    })),
  }
}
