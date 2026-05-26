import { NextRequest, NextResponse } from 'next/server'
// TODO: import { getDictionaryTerms } from '@agents/dictionary/api/dictionary'

export async function GET(request: NextRequest) {
  // TODO: implement - support ?search= query param
  void request
  return NextResponse.json({ terms: [] })
}
