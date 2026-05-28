/**
 * TASK-C: BPSPスクリプトシード（会話形式 Unit データ投入）
 * script_seed.json から各 Module の LECTURE Unit を冪等投入する
 * 使用方法: npx tsx prisma/seed/seed-bpsp-script.ts
 */
import { PrismaClient } from '@prisma/client'
import scriptData from './script_seed.json'

const prisma = new PrismaClient()

async function main() {
  let totalUnits = 0

  for (const level of scriptData.levels) {
    // Module を levelNumber で取得
    const module = await prisma.module.findUnique({
      where: { levelNumber: level.levelNumber },
    })

    if (!module) {
      console.warn(`  [SKIP] levelNumber=${level.levelNumber} の Module が見つかりません`)
      continue
    }

    // LECTURE Unit を upsert（id で冪等）
    const unit = await prisma.unit.upsert({
      where: { id: level.unitId },
      update: {
        title: level.unitTitle,
        script: level.script,
      },
      create: {
        id: level.unitId,
        moduleId: module.id,
        type: 'LECTURE',
        order: 1,
        title: level.unitTitle,
        script: level.script,
      },
    })

    console.log(
      `  Level ${level.levelNumber}: Unit "${unit.title}" (${level.script.length} turns)`
    )
    totalUnits++
  }

  console.log(`\nSeed complete:`)
  console.log(`  Units (LECTURE): ${totalUnits}`)
  console.log(`  Total turns:     ${scriptData.levels.reduce((s, l) => s + l.script.length, 0)}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
