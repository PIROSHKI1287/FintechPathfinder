import { prisma } from '@/core/db/prisma'
import { isLevelUnlockedForUser } from './levels'
import type { ScriptTurn } from '@agents/game-level/ui/ConversationViewer'

export interface LevelScript {
  levelId: string
  levelNumber: number
  title: string
  script: ScriptTurn[]
}

export async function getLevelScript(
  userId: string,
  levelNumber: number,
): Promise<LevelScript | null> {
  const module = await prisma.module.findUnique({
    where: { levelNumber },
    include: {
      units: {
        where: { type: 'LECTURE' },
        orderBy: { order: 'asc' },
        take: 1,
      },
    },
  })

  if (!module) return null

  const unlocked = await isLevelUnlockedForUser(userId, levelNumber)
  if (!unlocked) return null

  const unit = module.units[0]
  if (!unit?.script) return null

  const raw = unit.script
  if (!Array.isArray(raw)) return null

  const script = raw as unknown as ScriptTurn[]

  return {
    levelId: module.id,
    levelNumber: module.levelNumber,
    title: module.title,
    script,
  }
}
