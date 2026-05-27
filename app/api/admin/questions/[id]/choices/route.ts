import { handlePostAdminChoice } from '@agents/admin/api/questions'

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  return handlePostAdminChoice(params.id, request)
}
