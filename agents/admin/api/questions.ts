import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from './_guard'
import {
  listQuizQuestions,
  createQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
  createQuizChoice,
  updateQuizChoice,
  deleteQuizChoice,
} from '@agents/admin/logic/content'

const questionCreateSchema = z.object({
  questionText: z.string().min(1),
  type: z.enum(['single_choice', 'simulation']).default('single_choice'),
  sortOrder: z.number().int().default(0),
})

const questionUpdateSchema = z.object({
  questionText: z.string().min(1).optional(),
  type: z.enum(['single_choice', 'simulation']).optional(),
  sortOrder: z.number().int().optional(),
})

const choiceSchema = z.object({
  choiceText: z.string().min(1),
  isCorrect: z.boolean().default(false),
  complianceDelta: z.number().int().default(0),
  gmvDelta: z.number().int().default(0),
  uxDelta: z.number().int().default(0),
  feedbackText: z.string().nullable().optional(),
})

const choiceUpdateSchema = choiceSchema.partial()

export async function handleGetAdminQuestions(levelId: string): Promise<NextResponse> {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard
  const questions = await listQuizQuestions(levelId)
  return NextResponse.json({ questions })
}

export async function handlePostAdminQuestion(
  levelId: string,
  request: Request,
): Promise<NextResponse> {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard

  const body = await request.json().catch(() => null)
  const parsed = questionCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const question = await createQuizQuestion(levelId, parsed.data)
  return NextResponse.json({ question }, { status: 201 })
}

export async function handlePatchAdminQuestion(
  id: string,
  request: Request,
): Promise<NextResponse> {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard

  const body = await request.json().catch(() => null)
  const parsed = questionUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const question = await updateQuizQuestion(id, parsed.data)
  return NextResponse.json({ question })
}

export async function handleDeleteAdminQuestion(id: string): Promise<NextResponse> {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard
  await deleteQuizQuestion(id)
  return NextResponse.json({ ok: true })
}

export async function handlePostAdminChoice(
  questionId: string,
  request: Request,
): Promise<NextResponse> {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard

  const body = await request.json().catch(() => null)
  const parsed = choiceSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const choice = await createQuizChoice(questionId, parsed.data)
  return NextResponse.json({ choice }, { status: 201 })
}

export async function handlePatchAdminChoice(
  id: string,
  request: Request,
): Promise<NextResponse> {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard

  const body = await request.json().catch(() => null)
  const parsed = choiceUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const choice = await updateQuizChoice(id, parsed.data)
  return NextResponse.json({ choice })
}

export async function handleDeleteAdminChoice(id: string): Promise<NextResponse> {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard
  await deleteQuizChoice(id)
  return NextResponse.json({ ok: true })
}
