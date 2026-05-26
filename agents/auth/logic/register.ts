import bcrypt from 'bcryptjs'
import { prisma } from '@/core/db/prisma'
import { registerSchema, type RegisterInput } from '@/core/utils/schemas'

export type RegisterResult =
  | { success: true; userId: string }
  | { success: false; error: string; status: number }

export async function registerUser(body: unknown): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? 'バリデーションエラー',
      status: 400,
    }
  }

  const { email, password } = parsed.data as RegisterInput

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { success: false, error: 'このメールアドレスは既に登録されています', status: 409 }
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { email, passwordHash },
    select: { id: true },
  })

  return { success: true, userId: user.id }
}
