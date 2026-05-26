import { NextRequest } from 'next/server'
import { handleRegister } from '@agents/auth/api/register'

export async function POST(request: NextRequest) {
  const body = await request.json()
  return handleRegister(body)
}
