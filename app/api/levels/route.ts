import { handleGetLevels } from '@agents/game-level/api/levels'

export async function GET() {
  return handleGetLevels()
}
