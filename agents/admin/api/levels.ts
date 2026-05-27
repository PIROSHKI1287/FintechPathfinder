import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from './_guard'
import { listLevels, updateLevel } from '@agents/admin/logic/content'

const levelUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  isPublished: z.boolean().optional(),
})

export async function handleGetAdminLevels(): Promise<NextResponse> {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard
  const levels = await listLevels()
  return NextResponse.json({ levels })
}

export async function handlePatchAdminLevel(
  id: string,
  request: Request,
): Promise<NextResponse> {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard

  const body = await request.json().catch(() => null)
  const parsed = levelUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const level = await updateLevel(id, parsed.data)
  return NextResponse.json({ level })
}
