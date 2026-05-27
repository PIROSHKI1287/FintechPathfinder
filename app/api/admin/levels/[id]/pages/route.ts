import { handleGetAdminPages, handlePostAdminPage } from '@agents/admin/api/stories'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  return handleGetAdminPages(params.id)
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  return handlePostAdminPage(params.id, request)
}
