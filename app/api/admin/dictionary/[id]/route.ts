import { handlePatchAdminTerm, handleDeleteAdminTerm } from '@agents/admin/api/dictionary'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  return handlePatchAdminTerm(params.id, request)
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  return handleDeleteAdminTerm(params.id)
}
