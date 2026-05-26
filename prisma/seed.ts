import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ── レベル構造（全て isPublished=false。コンテンツ解禁後に true へ変更） ──
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

  const level3 = await prisma.level.upsert({
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

  // ── 辞書用語（社内識者確認済みの基本用語） ──
  const terms = [
    {
      id: 'dict-mdr',
      term: 'MDR',
      reading: 'えむでぃーあーる',
      definition:
        'Merchant Discount Rate（加盟店手数料）。カード決済時に加盟店が決済事業者に支払う手数料率。インターチェンジ・スキーム手数料・アクワイアラマージンの合計で構成される。',
      relatedLevelId: level1.id,
    },
    {
      id: 'dict-aml',
      term: 'AML',
      reading: 'えーえむえる',
      definition:
        'Anti-Money Laundering（マネーロンダリング対策）。不正資金の洗浄を防ぐための規制・社内手続き・システムの総称。BPSPは加盟店の資金フロー管理のためAML対策が必須。',
      relatedLevelId: level2.id,
    },
    {
      id: 'dict-kyc',
      term: 'KYC',
      reading: 'けーわいしー',
      definition:
        'Know Your Customer（顧客確認）。加盟店や取引先の実態・本人性・事業内容を確認するプロセス。資金決済法・犯罪収益移転防止法により義務付けられている。',
      relatedLevelId: level2.id,
    },
    {
      id: 'dict-keshikomi',
      term: '消込',
      reading: 'けしこみ',
      definition:
        '売掛金・未収金と入金データを照合して残高をゼロにする経理処理。BPSPでは加盟店への精算処理（売上代金の振込）と消込業務が日次・月次で発生する。',
      relatedLevelId: level3.id,
    },
    {
      id: 'dict-shikin-ido',
      term: '資金移動業',
      reading: 'しきんいどうぎょう',
      definition:
        '資金決済に関する法律（資金決済法）で定められた業種区分。銀行以外が為替取引を行うために必要な登録。BPSPが取り扱うサービス内容によっては登録が必要となる場合がある。',
      relatedLevelId: level2.id,
    },
    {
      id: 'dict-interchange',
      term: 'インターチェンジ',
      reading: 'いんたーちぇんじ',
      definition:
        'カードスキーム（VisaやMastercardなど）がアクワイアラからイシュアーへ支払う手数料。MDRの構成要素の一つで、業種・カード種別・取引金額等により異なる。',
      relatedLevelId: level1.id,
    },
    {
      id: 'dict-acquiring',
      term: 'アクワイアリング',
      reading: 'あくわいありんぐ',
      definition:
        '加盟店の開拓・審査・管理・精算を行う業務・事業モデル。アクワイアラ（加盟店契約会社）が担う。BPSPはアクワイアラの代理として加盟店サービスを提供することが多い。',
      relatedLevelId: level1.id,
    },
    {
      id: 'dict-chargeback',
      term: 'チャージバック',
      reading: 'ちゃーじばっく',
      definition:
        'カード会員が不正利用や商品未着を申告した際に、イシュアーがアクワイアラ・加盟店に売上代金を返還させるプロセス。BPSPは加盟店の不正リスク管理としてチャージバック率を監視する。',
      relatedLevelId: level1.id,
    },
    {
      id: 'dict-pci-dss',
      term: 'PCI DSS',
      reading: 'ぴーしーあい・でぃーえすえす',
      definition:
        'Payment Card Industry Data Security Standard。クレジットカード情報を取り扱う全ての事業者に適用されるセキュリティ基準。BPSPは加盟店に対しPCI DSSへの準拠を要求・支援する。',
      relatedLevelId: level2.id,
    },
    {
      id: 'dict-bin',
      term: 'BIN',
      reading: 'びん',
      definition:
        'Bank Identification Number。カード番号の最初の6〜8桁で、発行金融機関・カード種別・国などを識別する番号体系。BPSPは不正検知やルーティング処理でBINを参照する。',
      relatedLevelId: level1.id,
    },
    {
      id: 'dict-gmv',
      term: 'GMV',
      reading: 'じーえむぶい',
      definition:
        'Gross Merchandise Value（流通取引総額）。プラットフォーム上で処理された取引金額の総計。BPSPのビジネス規模・収益ポテンシャルを示す主要KPI。',
      relatedLevelId: level1.id,
    },
    {
      id: 'dict-embedded-finance',
      term: 'Embedded Finance',
      reading: 'えんべでっど・ふぁいなんす',
      definition:
        '非金融企業のサービスに金融機能（決済・融資・保険等）を組み込む形態。BPSPはEmbedded Financeのインフラ提供者として、EC・SaaSプラットフォームへの決済埋め込みを支援する。',
      relatedLevelId: level1.id,
    },
  ]

  for (const t of terms) {
    await prisma.dictionaryTerm.upsert({
      where: { id: t.id },
      update: { definition: t.definition },
      create: t,
    })
  }

  console.log(`Seed completed: 5 levels, ${terms.length} dictionary terms`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
