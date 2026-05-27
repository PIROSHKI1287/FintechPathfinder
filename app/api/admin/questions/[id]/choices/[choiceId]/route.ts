import { handlePatchAdminChoice, handleDeleteAdminChoice } from '@agents/admin/api/questions'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; choiceId: string } },
) {
  return handlePatchAdminChoice(params.choiceId, request)
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string; choiceId: string } },
) {
  return handleDeleteAdminChoice(params.choiceId)
}
