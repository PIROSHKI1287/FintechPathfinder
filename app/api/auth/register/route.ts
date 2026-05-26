import { NextRequest, NextResponse } from 'next/server'
// TODO: import { registerUser } from '@agents/auth/logic/register'

export async function POST(request: NextRequest) {
  // TODO: implement
  // const body = await request.json()
  // return registerUser(body)
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 })
}
