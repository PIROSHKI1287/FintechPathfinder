import { handleGetProgress } from '@agents/game-level/api/progress'

export async function GET() {
  return handleGetProgress()
}
