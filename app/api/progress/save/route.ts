import { NextRequest } from 'next/server'
import { handleSaveProgress } from '@agents/game-level/api/progress'

export async function POST(request: NextRequest) {
  return handleSaveProgress(request)
}
