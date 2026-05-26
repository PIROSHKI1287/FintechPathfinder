import { NextRequest } from 'next/server'
import { handleGetTerms } from '@agents/dictionary/api/dictionary'

export async function GET(request: NextRequest) {
  return handleGetTerms(request)
}
