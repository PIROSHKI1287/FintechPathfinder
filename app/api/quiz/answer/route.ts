import { NextRequest } from 'next/server'
import { handleSubmitAnswer } from '@agents/quiz/api/answer'

export async function POST(request: NextRequest) {
  return handleSubmitAnswer(request)
}
