import { prisma } from '@/core/db/prisma'

export interface PreviewPage {
  levelId: string
  levelNumber: number
  title: string
  heading: string | null
  body: string | null
}

export async function getPreviewPage(): Promise<PreviewPage | null> {
  const module = await prisma.module.findUnique({
    where: { levelNumber: 1 },
    include: {
      storyPages: {
        where: { pageNumber: 1 },
        take: 1,
      },
    },
  })

  if (!module || !module.isPublished) return null

  const page = module.storyPages[0]
  if (!page) return null

  const raw = page.contentJson
  const content =
    raw !== null && typeof raw === 'object' && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {}

  return {
    levelId: module.id,
    levelNumber: module.levelNumber,
    title: module.title,
    heading: typeof content.heading === 'string' ? content.heading : null,
    body: typeof content.body === 'string' ? content.body : null,
  }
}
