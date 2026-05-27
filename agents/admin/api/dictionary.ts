import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from './_guard'
import {
  listDictionaryTerms,
  createDictionaryTerm,
  updateDictionaryTerm,
  deleteDictionaryTerm,
} from '@agents/admin/logic/content'

const termSchema = z.object({
  term: z.string().min(1),
  reading: z.string().nullable().optional(),
  definition: z.string().min(1),
  relatedLevelId: z.string().nullable().optional(),
})

const termUpdateSchema = termSchema.partial()

export async function handleGetAdminDictionary(): Promise<NextResponse> {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard
  const terms = await listDictionaryTerms()
  return NextResponse.json({ terms })
}

export async function handlePostAdminTerm(request: Request): Promise<NextResponse> {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard

  const body = await request.json().catch(() => null)
  const parsed = termSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const term = await createDictionaryTerm(parsed.data)
  return NextResponse.json({ term }, { status: 201 })
}

export async function handlePatchAdminTerm(
  id: string,
  request: Request,
): Promise<NextResponse> {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard

  const body = await request.json().catch(() => null)
  const parsed = termUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const term = await updateDictionaryTerm(id, parsed.data)
  return NextResponse.json({ term })
}

export async function handleDeleteAdminTerm(id: string): Promise<NextResponse> {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard
  await deleteDictionaryTerm(id)
  return NextResponse.json({ ok: true })
}
