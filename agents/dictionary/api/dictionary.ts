import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/core/auth/auth'
import { getTerms, getTerm } from '@agents/dictionary/logic/terms'
import { dictionarySearchSchema } from '@/core/utils/schemas'

export async function handleGetTerms(request: NextRequest): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const searchParam = request.nextUrl.searchParams.get('search') ?? undefined
  const parsed = dictionarySearchSchema.safeParse({ search: searchParam })
  if (!parsed.success) {
    return NextResponse.json({ error: '検索文字列が長すぎます' }, { status: 400 })
  }

  const terms = await getTerms(parsed.data.search)
  return NextResponse.json({ terms })
}

export async function handleGetTerm(id: string): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const term = await getTerm(id)
  if (!term) {
    return NextResponse.json({ error: '用語が見つかりません' }, { status: 404 })
  }

  return NextResponse.json({ term })
}
