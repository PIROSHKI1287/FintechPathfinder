import { handlePatchAdminPage, handleDeleteAdminPage } from '@agents/admin/api/stories'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; pageId: string } },
) {
  return handlePatchAdminPage(params.pageId, params.id, request)
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string; pageId: string } },
) {
  return handleDeleteAdminPage(params.pageId)
}
