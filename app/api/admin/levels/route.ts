import { handleGetAdminLevels } from '@agents/admin/api/levels'

export async function GET() {
  return handleGetAdminLevels()
}
