import { NextRequest } from 'next/server'
import { handleConsent } from '@agents/auth/api/consent'

export async function POST(request: NextRequest) {
  return handleConsent(request)
}
