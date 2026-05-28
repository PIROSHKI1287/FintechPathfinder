/**
 * 開発テスト用シードデータ
 * 本番環境では実行しないこと。
 * 使用方法: npm run db:seed:dev
 */
import { PrismaClient } from '@prisma/client'

if (process.env.NODE_ENV === 'production') {
  console.error('ERROR: seed-dev.ts は本番環境で実行できません')
  process.exit(1)
}

const prisma = new PrismaClient()

async function main() {
  // Level 1 を公開状態に変更（ゲームメカニクスのテスト用）
  const level1 = await prisma.module.update({
    where: { levelNumber: 1 },
    data: { isPublished: true },
  })

  // ── Level 1 ストーリーページ（プレースホルダー） ──
  const storyPages = [
    {
      levelId: level1.id,
      pageNumber: 1,
      contentJson: {
        heading: 'BPSPとは何か',
        body: '【開発テスト用コンテンツ】\n\nBPSP（Business Payment Service Provider）は、加盟店と決済事業者の間に立ち、決済サービスを仲介・提供する事業者です。\n\n正式なコンテンツは社内識者レビュー後に差し替えられます。このページは動作確認専用です。',
      },
    },
    {
      levelId: level1.id,
      pageNumber: 2,
      contentJson: {
        heading: '4者間モデル',
        body: '【開発テスト用コンテンツ】\n\n決済の4者間モデル:\n1. カード会員（消費者）\n2. 加盟店\n3. アクワイアラ（加盟店側金融機関）\n4. イシュアー（カード発行会社）\n\nBPSPはアクワイアラと加盟店の間に位置し、双方をつなぐ役割を担います。',
      },
    },
    {
      levelId: level1.id,
      pageNumber: 3,
      contentJson: {
        heading: 'コンプライアンスの重要性',
        body: '【開発テスト用コンテンツ】\n\nBPSPとして事業を行う上で、コンプライアンス（法令・規制への準拠）は最優先事項です。\n\n資金決済法・犯罪収益移転防止法・PCI DSSなどの規制に違反すると、事業停止・行政処分・社会的信頼失墜につながります。\n\n次のクイズでコンプライアンスへの理解を確認しましょう。',
      },
    },
  ]

  for (const page of storyPages) {
    await prisma.storyPage.upsert({
      where: { levelId_pageNumber: { levelId: level1.id, pageNumber: page.pageNumber } },
      update: { contentJson: page.contentJson },
      create: page,
    })
  }

  // ── Level 1 クイズ問題（ゲームメカニクス確認用） ──
  // Q1: 基本問題（正解でコンプライアンス+5）
  const q1 = await prisma.quiz.upsert({
    where: { id: 'dev-q1-l1' },
    update: {},
    create: {
      id: 'dev-q1-l1',
      moduleId: level1.id,
      question:
        '【テスト問題①】BPSPとして新しい加盟店から申し込みがありました。最初に行うべき対応はどれですか？',
      type: 'single_choice',
      sortOrder: 1,
    },
  })

  const q1choices = [
    {
      id: 'dev-q1-c1',
      quizId: q1.id,
      text: 'KYC（本人確認）と事業内容の審査を実施する',
      isCorrect: true,
      complianceDelta: 5,
      gmvDelta: 10,
      uxDelta: 0,
      feedbackText:
        '正解です。加盟店審査でKYCと事業内容確認は必須のコンプライアンス対応です。審査なしでの契約締結は法的リスクを招きます。',
    },
    {
      id: 'dev-q1-c2',
      quizId: q1.id,
      text: '早急に契約書を送って契約を締結する',
      isCorrect: false,
      complianceDelta: -15,
      gmvDelta: 20,
      uxDelta: 0,
      feedbackText:
        '不正解です。審査なしでの契約締結は犯罪収益移転防止法違反のリスクがあります。GMVは増えますが、コンプライアンス違反により後に重大なペナルティを受ける恐れがあります。',
    },
    {
      id: 'dev-q1-c3',
      quizId: q1.id,
      text: '競合他社の条件を先に調べてから対応する',
      isCorrect: false,
      complianceDelta: 0,
      gmvDelta: 0,
      uxDelta: -10,
      feedbackText:
        '不正解です。競合調査より先にコンプライアンス対応（KYC・審査）が優先されます。加盟店体験（UX）も悪化します。',
    },
  ]

  for (const c of q1choices) {
    await prisma.quizOption.upsert({
      where: { id: c.id },
      update: {},
      create: c,
    })
  }

  // Q2: 中級問題（不正解で大きくコンプライアンス低下）
  const q2 = await prisma.quiz.upsert({
    where: { id: 'dev-q2-l1' },
    update: {},
    create: {
      id: 'dev-q2-l1',
      moduleId: level1.id,
      question:
        '【テスト問題②】加盟店の月次精算データに、通常の10倍の金額の取引が複数件含まれていました。どう対応しますか？',
      type: 'single_choice',
      sortOrder: 2,
    },
  })

  const q2choices = [
    {
      id: 'dev-q2-c1',
      quizId: q2.id,
      text: 'AML部門に報告し、当該取引を保留にして調査を開始する',
      isCorrect: true,
      complianceDelta: 10,
      gmvDelta: -20,
      uxDelta: 5,
      feedbackText:
        '正解です。異常取引はAML規制上、疑わしい取引として報告義務があります。短期的にGMVは減少しますが、コンプライアンスリスクを適切に回避できます。',
    },
    {
      id: 'dev-q2-c2',
      quizId: q2.id,
      text: '加盟店に確認の連絡を入れ、説明がつけば通常処理する',
      isCorrect: false,
      complianceDelta: -10,
      gmvDelta: 10,
      uxDelta: 0,
      feedbackText:
        '不正解です。加盟店への確認だけでは不十分です。疑わしい取引は社内のコンプライアンス・AML部門への報告が義務付けられています。',
    },
    {
      id: 'dev-q2-c3',
      quizId: q2.id,
      text: '大口取引は歓迎すべきで、問題ないと判断して通常処理する',
      isCorrect: false,
      complianceDelta: -30,
      gmvDelta: 30,
      uxDelta: 0,
      feedbackText:
        '不正解です。金額の大きさを理由に疑わしい取引を見過ごすことは、AML規制の重大違反です。コンプライアンススコアが大幅に低下します。',
    },
  ]

  for (const c of q2choices) {
    await prisma.quizOption.upsert({
      where: { id: c.id },
      update: {},
      create: c,
    })
  }

  // Q3: ゲームオーバーリスク問題
  const q3 = await prisma.quiz.upsert({
    where: { id: 'dev-q3-l1' },
    update: {},
    create: {
      id: 'dev-q3-l1',
      moduleId: level1.id,
      question:
        '【テスト問題③ ゲームオーバーリスクあり】最重要顧客（売上の30%）から、規制当局の目をかいくぐりたい取引の処理を依頼されました。',
      type: 'single_choice',
      sortOrder: 3,
    },
  })

  const q3choices = [
    {
      id: 'dev-q3-c1',
      quizId: q3.id,
      text: '顧客規模にかかわらず断り、コンプライアンス部門へ即座に報告する',
      isCorrect: true,
      complianceDelta: 15,
      gmvDelta: -50,
      uxDelta: 5,
      feedbackText:
        '正解です。どれだけ重要な顧客でも、規制違反となる取引は絶対に断るべきです。短期的な売上損失より、事業存続・社会的信頼の方が遥かに重要です。',
    },
    {
      id: 'dev-q3-c2',
      quizId: q3.id,
      text: '売上の30%を失うリスクを考え、今回だけ例外として処理する',
      isCorrect: false,
      complianceDelta: -100,
      gmvDelta: 100,
      uxDelta: -20,
      feedbackText:
        'ゲームオーバー。規制当局の目をかいくぐる取引の処理は重大な法令違反です。発覚すれば業務停止・行政処分・刑事責任を問われます。コンプライアンス = 0。',
    },
    {
      id: 'dev-q3-c3',
      quizId: q3.id,
      text: '法務部門と相談しながら、取引の合法性を慎重に検討する',
      isCorrect: false,
      complianceDelta: 5,
      gmvDelta: -30,
      uxDelta: 0,
      feedbackText:
        '惜しいですが不正解です。「規制当局の目をかいくぐりたい」という依頼時点で断り・報告が正解です。合法性の検討余地はありません。',
    },
  ]

  for (const c of q3choices) {
    await prisma.quizOption.upsert({
      where: { id: c.id },
      update: {},
      create: c,
    })
  }

  console.log('Dev seed completed:')
  console.log('  - Level 1 isPublished=true')
  console.log('  - 3 story pages (placeholder)')
  console.log('  - 3 quiz questions with choices (including game-over risk)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
