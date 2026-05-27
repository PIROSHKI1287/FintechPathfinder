import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from './_guard'
import { listStoryPages, upsertStoryPage, deleteStoryPage } from '@agents/admin/logic/content'

const storyPageSchema = z.object({
  pageNumber: z.number().int().positive(),
  heading: z.string().min(1),
  body: z.string().min(1),
  diagramUrl: z.string().url().nullable().optional(),
})

const storyPageUpdateSchema = z.object({
  heading: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  diagramUrl: z.string().url().nullable().optional(),
})

export async function handleGetAdminPages(levelId: string): Promise<NextResponse> {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard
  const pages = await listStoryPages(levelId)
  return NextResponse.json({ pages })
}

export async function handlePostAdminPage(
  levelId: string,
  request: Request,
): Promise<NextResponse> {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard

  const body = await request.json().catch(() => null)
  const parsed = storyPageSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { pageNumber, heading, body: bodyText, diagramUrl } = parsed.data
  const page = await upsertStoryPage(levelId, pageNumber, { heading, body: bodyText }, diagramUrl)
  return NextResponse.json({ page }, { status: 201 })
}

export async function handlePatchAdminPage(
  pageId: string,
  levelId: string,
  request: Request,
): Promise<NextResponse> {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard

  const body = await request.json().catch(() => null)
  const parsed = storyPageUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Fetch current page to merge partial update
  const pages = await listStoryPages(levelId)
  const current = pages.find((p) => p.id === pageId)
  if (!current) {
    return NextResponse.json({ error: 'ページが見つかりません' }, { status: 404 })
  }

  const currentContent =
    current.contentJson !== null &&
    typeof current.contentJson === 'object' &&
    !Array.isArray(current.contentJson)
      ? (current.contentJson as Record<string, unknown>)
      : {}

  const heading =
    typeof parsed.data.heading === 'string'
      ? parsed.data.heading
      : (typeof currentContent.heading === 'string' ? currentContent.heading : '')
  const bodyText =
    typeof parsed.data.body === 'string'
      ? parsed.data.body
      : (typeof currentContent.body === 'string' ? currentContent.body : '')
  const diagramUrl =
    'diagramUrl' in parsed.data ? parsed.data.diagramUrl : current.diagramUrl

  const page = await upsertStoryPage(current.levelId, current.pageNumber, { heading, body: bodyText }, diagramUrl)
  return NextResponse.json({ page })
}

export async function handleDeleteAdminPage(pageId: string): Promise<NextResponse> {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard
  await deleteStoryPage(pageId)
  return NextResponse.json({ ok: true })
}
