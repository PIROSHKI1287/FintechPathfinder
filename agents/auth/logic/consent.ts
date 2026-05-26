import { prisma } from '@/core/db/prisma'

export async function recordConsent(userId: string, ipAddress?: string): Promise<void> {
  await prisma.disclaimerConsent.create({
    data: { userId, ipAddress: ipAddress ?? null },
  })
}
