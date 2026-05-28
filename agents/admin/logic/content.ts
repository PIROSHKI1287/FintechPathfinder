import { prisma } from '@/core/db/prisma'

export async function listLevels() {
  return prisma.module.findMany({
    orderBy: { levelNumber: 'asc' },
    select: {
      id: true,
      levelNumber: true,
      title: true,
      description: true,
      isPublished: true,
      sortOrder: true,
      _count: { select: { storyPages: true, quizzes: true } },
    },
  })
}

export async function updateLevel(
  id: string,
  data: { title?: string; description?: string; isPublished?: boolean },
) {
  return prisma.module.update({ where: { id }, data })
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
  return prisma.quiz.findMany({
    where: { moduleId: levelId },
    orderBy: { sortOrder: 'asc' },
    include: { options: { orderBy: { id: 'asc' } } },
  })
}

export async function createQuizQuestion(
  levelId: string,
  data: { questionText: string; type: string; sortOrder: number },
) {
  return prisma.quiz.create({
    data: { moduleId: levelId, question: data.questionText, type: data.type, sortOrder: data.sortOrder },
    include: { options: true },
  })
}

export async function updateQuizQuestion(
  id: string,
  data: { questionText?: string; type?: string; sortOrder?: number },
) {
  return prisma.quiz.update({
    where: { id },
    data: {
      ...(data.questionText !== undefined && { question: data.questionText }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
    },
  })
}

export async function deleteQuizQuestion(id: string) {
  return prisma.quiz.delete({ where: { id } })
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
  return prisma.quizOption.create({
    data: {
      quizId: questionId,
      text: data.choiceText,
      isCorrect: data.isCorrect,
      complianceDelta: data.complianceDelta,
      gmvDelta: data.gmvDelta,
      uxDelta: data.uxDelta,
      feedbackText: data.feedbackText,
    },
  })
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
  return prisma.quizOption.update({
    where: { id },
    data: {
      ...(data.choiceText !== undefined && { text: data.choiceText }),
      ...(data.isCorrect !== undefined && { isCorrect: data.isCorrect }),
      ...(data.complianceDelta !== undefined && { complianceDelta: data.complianceDelta }),
      ...(data.gmvDelta !== undefined && { gmvDelta: data.gmvDelta }),
      ...(data.uxDelta !== undefined && { uxDelta: data.uxDelta }),
      ...(data.feedbackText !== undefined && { feedbackText: data.feedbackText }),
    },
  })
}

export async function deleteQuizChoice(id: string) {
  return prisma.quizOption.delete({ where: { id } })
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
