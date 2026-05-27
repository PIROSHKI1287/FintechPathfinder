import { handleGetAdminDictionary, handlePostAdminTerm } from '@agents/admin/api/dictionary'

export async function GET() {
  return handleGetAdminDictionary()
}

export async function POST(request: Request) {
  return handlePostAdminTerm(request)
}
