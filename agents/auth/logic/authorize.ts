import bcrypt from 'bcryptjs'
import { prisma } from '@/core/db/prisma'

export async function authorizeCredentials(
  email: string,
  password: string,
): Promise<{ id: string; email: string; role: string } | null> {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return null

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  })

  return { id: user.id, email: user.email, role: user.role }
}
