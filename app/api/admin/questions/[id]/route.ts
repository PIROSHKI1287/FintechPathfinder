import { handlePatchAdminQuestion, handleDeleteAdminQuestion } from '@agents/admin/api/questions'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  return handlePatchAdminQuestion(params.id, request)
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  return handleDeleteAdminQuestion(params.id)
}
