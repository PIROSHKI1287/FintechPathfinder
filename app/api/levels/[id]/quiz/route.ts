import { handleGetQuiz } from '@agents/quiz/api/quiz'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  return handleGetQuiz(params.id)
}
