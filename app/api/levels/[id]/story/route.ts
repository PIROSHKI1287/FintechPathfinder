import { handleGetStory } from '@agents/game-level/api/story'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  return handleGetStory(params.id)
}
