import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Level 1: 基礎概念
  const level1 = await prisma.level.upsert({
    where: { levelNumber: 1 },
    update: {},
    create: {
      levelNumber: 1,
      title: 'Level 1: BPSPの基礎概念',
      description: 'BPSPの4者間の仕組みと「金の流れ」を学ぶ',
      isPublished: false,
      sortOrder: 1,
    },
  })

  // Level 2: 法規制
  const level2 = await prisma.level.upsert({
    where: { levelNumber: 2 },
    update: {},
    create: {
      levelNumber: 2,
      title: 'Level 2: 法規制',
      description: '資金決済法・割販法・AML/KYCを学ぶ',
      isPublished: false,
      sortOrder: 2,
    },
  })

  // Level 3: 実務・システム
  await prisma.level.upsert({
    where: { levelNumber: 3 },
    update: {},
    create: {
      levelNumber: 3,
      title: 'Level 3: 実務・システム',
      description: 'システム連携・消込・CF管理を学ぶ',
      isPublished: false,
      sortOrder: 3,
    },
  })

  // Level 4: 営業・提案
  await prisma.level.upsert({
    where: { levelNumber: 4 },
    update: {},
    create: {
      levelNumber: 4,
      title: 'Level 4: 営業・提案',
      description: 'ROI訴求・反対意見対応・ロールプレイングを学ぶ',
      isPublished: false,
      sortOrder: 4,
    },
  })

  // Level 5: BizDev・戦略
  await prisma.level.upsert({
    where: { levelNumber: 5 },
    update: {},
    create: {
      levelNumber: 5,
      title: 'Level 5: BizDev・戦略',
      description: 'アライアンス・Embedded Finance・UEを学ぶ',
      isPublished: false,
      sortOrder: 5,
    },
  })

  // 辞書サンプル（社内識者レビュー後に正式追加）
  await prisma.dictionaryTerm.upsert({
    where: { id: 'sample-mdr' },
    update: {},
    create: {
      id: 'sample-mdr',
      term: 'MDR',
      reading: 'えむでぃーあーる',
      definition: 'Merchant Discount Rate（加盟店手数料）。カード決済時に加盟店がカード会社等に支払う手数料率。',
      relatedLevelId: level1.id,
    },
  })

  await prisma.dictionaryTerm.upsert({
    where: { id: 'sample-aml' },
    update: {},
    create: {
      id: 'sample-aml',
      term: 'AML',
      reading: 'えーえむえる',
      definition: 'Anti-Money Laundering（マネーロンダリング対策）。不正資金の洗浄を防ぐための規制・手続き。',
      relatedLevelId: level2.id,
    },
  })

  console.log('Seed completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
