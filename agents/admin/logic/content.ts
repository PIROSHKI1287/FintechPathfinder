import { prisma } from '@/core/db/prisma'

export async function listLevels() {
  return prisma.level.findMany({
    orderBy: { levelNumber: 'asc' },
    select: {
      id: true,
      levelNumber: true,
      title: true,
      description: true,
      isPublished: true,
      sortOrder: true,
      _count: { select: { storyPages: true, quizQuestions: true } },
    },
  })
}

export async function updateLevel(
  id: string,
  data: { title?: string; description?: string; isPublished?: boolean },
) {
  return prisma.level.update({ where: { id }, data })
}

export async function listStoryPages(levelId: string) {
  return prisma.storyPage.findMany({
    where: { levelId },
    orderBy: { pageNumber: 'asc' },
  })
}

export async function upsertStoryPage(
  levelId: string,
  pageNumber: number,
  contentJson: { heading: string; body: string },
  diagramUrl?: string | null,
) {
  return prisma.storyPage.upsert({
    where: { levelId_pageNumber: { levelId, pageNumber } },
    update: { contentJson, diagramUrl: diagramUrl ?? null },
    create: { levelId, pageNumber, contentJson, diagramUrl: diagramUrl ?? null },
  })
}

export async function deleteStoryPage(pageId: string) {
  return prisma.storyPage.delete({ where: { id: pageId } })
}

export async function listQuizQuestions(levelId: string) {
  return prisma.quizQuestion.findMany({
    where: { levelId },
    orderBy: { sortOrder: 'asc' },
    include: { choices: { orderBy: { id: 'asc' } } },
  })
}

export async function createQuizQuestion(
  levelId: string,
  data: { questionText: string; type: string; sortOrder: number },
) {
  return prisma.quizQuestion.create({
    data: { levelId, ...data },
    include: { choices: true },
  })
}

export async function updateQuizQuestion(
  id: string,
  data: { questionText?: string; type?: string; sortOrder?: number },
) {
  return prisma.quizQuestion.update({ where: { id }, data })
}

export async function deleteQuizQuestion(id: string) {
  return prisma.quizQuestion.delete({ where: { id } })
}

export async function createQuizChoice(
  questionId: string,
  data: {
    choiceText: string
    isCorrect: boolean
    complianceDelta: number
    gmvDelta: number
    uxDelta: number
    feedbackText?: string | null
  },
) {
  return prisma.quizChoice.create({ data: { questionId, ...data } })
}

export async function updateQuizChoice(
  id: string,
  data: {
    choiceText?: string
    isCorrect?: boolean
    complianceDelta?: number
    gmvDelta?: number
    uxDelta?: number
    feedbackText?: string | null
  },
) {
  return prisma.quizChoice.update({ where: { id }, data })
}

export async function deleteQuizChoice(id: string) {
  return prisma.quizChoice.delete({ where: { id } })
}

export async function listDictionaryTerms() {
  return prisma.dictionaryTerm.findMany({
    orderBy: { term: 'asc' },
    include: {
      relatedLevel: { select: { levelNumber: true, title: true } },
    },
  })
}

export async function createDictionaryTerm(data: {
  term: string
  reading?: string | null
  definition: string
  relatedLevelId?: string | null
}) {
  return prisma.dictionaryTerm.create({ data })
}

export async function updateDictionaryTerm(
  id: string,
  data: {
    term?: string
    reading?: string | null
    definition?: string
    relatedLevelId?: string | null
  },
) {
  return prisma.dictionaryTerm.update({ where: { id }, data })
}

export async function deleteDictionaryTerm(id: string) {
  return prisma.dictionaryTerm.delete({ where: { id } })
}
