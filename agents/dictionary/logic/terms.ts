import { prisma } from '@/core/db/prisma'

export interface Term {
  id: string
  term: string
  reading: string | null
  definition: string
  relatedLevelId: string | null
}

export interface TermDetail extends Term {
  createdAt: Date
}

export async function getTerms(search?: string): Promise<Term[]> {
  const where = search?.trim()
    ? {
        OR: [
          { term: { contains: search, mode: 'insensitive' as const } },
          { reading: { contains: search, mode: 'insensitive' as const } },
          { definition: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const terms = await prisma.dictionaryTerm.findMany({
    where,
    orderBy: [{ term: 'asc' }],
    select: {
      id: true,
      term: true,
      reading: true,
      definition: true,
      relatedLevelId: true,
    },
  })

  return terms
}

export async function getTerm(id: string): Promise<TermDetail | null> {
  const term = await prisma.dictionaryTerm.findUnique({
    where: { id },
    select: {
      id: true,
      term: true,
      reading: true,
      definition: true,
      relatedLevelId: true,
      createdAt: true,
    },
  })
  return term
}
