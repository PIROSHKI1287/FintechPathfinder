import { NextResponse } from 'next/server'
// TODO: import { getQuizQuestions } from '@agents/quiz/api/quiz'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  // TODO: implement
  void params
  return NextResponse.json({ questions: [] })
}
