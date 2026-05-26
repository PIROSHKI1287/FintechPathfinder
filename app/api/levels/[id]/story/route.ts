import { NextResponse } from 'next/server'
// TODO: import { getStoryPages } from '@agents/game-level/api/story'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  // TODO: implement
  void params
  return NextResponse.json({ pages: [] })
}
