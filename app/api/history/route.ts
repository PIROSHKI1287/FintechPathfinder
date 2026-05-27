import { handleGetHistory } from '@agents/game-level/api/history'

export async function GET() {
  return handleGetHistory()
}
