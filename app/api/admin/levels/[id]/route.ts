import { handlePatchAdminLevel } from '@agents/admin/api/levels'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  return handlePatchAdminLevel(params.id, request)
}
