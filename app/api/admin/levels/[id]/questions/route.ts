import { handleGetAdminQuestions, handlePostAdminQuestion } from '@agents/admin/api/questions'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  return handleGetAdminQuestions(params.id)
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  return handlePostAdminQuestion(params.id, request)
}
