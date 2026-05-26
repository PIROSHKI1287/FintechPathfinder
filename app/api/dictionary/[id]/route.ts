import { NextResponse } from 'next/server'
// TODO: import { getDictionaryTerm } from '@agents/dictionary/api/dictionary'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  // TODO: implement
  void params
  return NextResponse.json({ term: null })
}
