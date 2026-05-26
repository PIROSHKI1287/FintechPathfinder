import { NextResponse } from 'next/server'
import { registerUser } from '@agents/auth/logic/register'

export async function handleRegister(body: unknown): Promise<NextResponse> {
  const result = await registerUser(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }
  return NextResponse.json({ message: '登録が完了しました' }, { status: 201 })
}
