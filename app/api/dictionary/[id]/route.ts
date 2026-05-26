import { handleGetTerm } from '@agents/dictionary/api/dictionary'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  return handleGetTerm(params.id)
}
