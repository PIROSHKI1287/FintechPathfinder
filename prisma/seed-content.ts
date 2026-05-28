/**
 * F009–F013 本番コンテンツシード（Level 1〜5）
 * 社内識者レビュー済み（BPSP_knowledge_base.md 2026年5月版に基づく）
 * 使用方法: npm run db:seed:content
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const [level1, level2, level3, level4, level5] = await Promise.all([
    prisma.module.findFirstOrThrow({ where: { levelNumber: 1 } }),
    prisma.module.findFirstOrThrow({ where: { levelNumber: 2 } }),
    prisma.module.findFirstOrThrow({ where: { levelNumber: 3 } }),
    prisma.module.findFirstOrThrow({ where: { levelNumber: 4 } }),
    prisma.module.findFirstOrThrow({ where: { levelNumber: 5 } }),
  ])

  await prisma.module.updateMany({ data: { isPublished: true } })
  console.log('All levels set to isPublished=true')

  // ── Level 1: 基礎概念 ──────────────────────────────────────────────────────
  const l1pages = [
    {
      pageNumber: 1,
      heading: 'BPSPとは何か',
      body: 'BPSP（Business Payment Service Provider）は、カード決済を受け付けていない売り手企業（サプライヤー）と、カード決済で支払いたい買い手企業（バイヤー）の間に「疑似加盟店」として介在し、両者の決済を成立させるBtoB向けの決済ソリューションです。\n\n■ 誕生の背景\n日本の企業間決済は推計1,000兆円超の市場規模を持ちますが、その大半がいまだ銀行振込・紙の請求書ベースです。BtoCのキャッシュレス比率が58%に達した今も、BtoBは大きく遅れています。\n\n■ 2つの課題を同時に解決\nバイヤーはカードの支払サイクルを活用して実質最大60日程度の支払繰延が可能になります。サプライヤーは従来通り「銀行振込」で代金を受け取るため、商習慣を変える必要がありません。\n\n■ 業界の呼称\n・Visa: BPSP（Business Payments Solution Provider）\n・Mastercard: BPAP（Business Payment Aggregator Program）\n・JCB: BBPS（BtoB Payment Service）\n2025年12月からは「請求書カード払い（BIPS）」として業界統一されました。',
    },
    {
      pageNumber: 2,
      heading: 'BtoCカード決済の4者間モデル',
      body: 'カード決済は4つの主体（＋国際ブランド）によって成立しています。\n\n■ 4つの主体\n① カード会員（個人消費者）：カードを使って支払う\n② 加盟店：アクワイアラと加盟店契約を結び、カードを受け付ける\n③ アクワイアラ（加盟店契約会社）：加盟店を開拓・審査・管理し、売上代金を立替払いする\n④ イシュア（カード発行会社）：カード会員へ与信を提供し、利用代金を引き落とす\n（国際ブランド：Visa・Mastercard・JCB等が決済ネットワークとブランドルールを提供）\n\n■ 手数料の流れ（MDR）\n加盟店はカード利用時にMDR（Merchant Discount Rate：加盟店手数料）をアクワイアラに支払います。MDRは「インターチェンジ」（アクワイアラ→イシュアへの手数料）＋国際ブランド手数料＋アクワイアラの利益で構成されます。\n\n■ BtoCとBtoBの大きな違い\nBtoCでは「手数料は売り手負担」が一般的ですが、BtoBのBPSPでは「手数料は買い手（バイヤー）負担」が主流です。この違いがBPSP普及の鍵です。',
    },
    {
      pageNumber: 3,
      heading: 'BPSPの5者間モデルとお金の流れ',
      body: 'BPSPはアクワイアラと加盟店契約を結ぶ「疑似加盟店」として機能します。通常の4者間モデルにBPSP事業者が加わった5者構造です。\n\n■ お金の流れ（6ステップ）\n① バイヤーがサプライヤーから商品・サービスを購入\n② サプライヤーがバイヤーに請求書を発行\n③ バイヤーがBPSP事業者のプラットフォームで請求書を登録し、カード決済を依頼\n④ BPSP事業者がサプライヤーに【銀行振込で】代金を立替払い\n⑤ イシュアがバイヤーの口座からカード利用代金を引き落とし\n⑥ BPSP事業者は手数料（一般に2.5〜4%程度）を収受\n\n■ ポイント\n・サプライヤーは「普通の銀行振込」として受け取るため、商習慣を変える必要がない\n・バイヤーはカードの締め日・支払日を活用し、実質最大60日の支払繰延が可能\n・手数料はバイヤー側が負担（BtoBの常識に合わせた設計）',
    },
    {
      pageNumber: 4,
      heading: 'BtoBにキャッシュレスが浸透しない理由',
      body: '日本のBtoC決済では2025年のキャッシュレス比率が58.0%に達しましたが、企業間（BtoB）決済では依然として銀行振込・紙の請求書が主流です。\n\n■ 理由①：手数料負担の問題\nBtoC決済では加盟店（売り手）が手数料を負担します。しかし、企業間取引の平均金額は数万〜数千万円と高く、1〜3%の手数料は薄利多売の業界では利益を圧迫します。「売り手がカードを受け付けたくない」のが本音です。\n\n■ 理由②：環境整備のコーディネーションコスト\nすべての取引先が同じ決済手段に対応していなければ、一部だけ導入しても効果が限定的です。銀行振込のような「全社共通のインフラ」を置き換えるには、業界全体の足並みが必要です。\n\n■ BPSPはどう解決するか\n・手数料をバイヤー（買い手）が負担する設計に変えることで、サプライヤー側の抵抗をなくす\n・サプライヤーには「普通の銀行振込」として入金するため、既存の商習慣・システムを変更不要',
    },
    {
      pageNumber: 5,
      heading: 'バイヤー・サプライヤーそれぞれのメリット',
      body: '■ バイヤー（買い手企業）のメリット\n① 資金繰り改善：カードの支払サイクルを活用し、実質最大60日の支払繰延が可能。短期借入金利と比較して、手数料を払っても資金調達コストが安くなるケースも。\n② ポイント還元：高額の企業間取引でカードポイントを獲得。1%還元なら2.5%手数料でも実質負担は1.5%相当。\n③ 業務効率化：振込手数料削減、支払業務の一元化、電子帳簿保存法・インボイス制度対応の効率化。\n④ 支払管理の簡素化：期日管理・振込操作の手間が減少。\n\n■ サプライヤー（売り手企業）のメリット・注意点\n◎ メリット：\n・売掛金が確実に銀行振込で入金される\n・バイヤーがカードを使っていることに気づかないケースもあり、商習慣が変わらない\n・与信リスクは実質的にBPSP事業者・イシュアが負う\n\n△ 注意点：\n・サプライヤーとBPSP事業者の間に直接契約がないケースが多く、振込名義が見覚えのない名前になることがある\n・業界自主規制（BIPSガイドライン）でサプライヤー保護のルールが整備されてきた',
    },
  ]

  for (const p of l1pages) {
    await prisma.storyPage.upsert({
      where: { levelId_pageNumber: { levelId: level1.id, pageNumber: p.pageNumber } },
      update: { contentJson: { heading: p.heading, body: p.body } },
      create: { levelId: level1.id, pageNumber: p.pageNumber, contentJson: { heading: p.heading, body: p.body } },
    })
  }

  const l1questions = [
    {
      id: 'dev-q1-l1',
      questionText: 'BPSPサービスを利用する際、手数料（サービス利用料）を負担するのは通常どの主体ですか？',
      sortOrder: 1,
      choices: [
        {
          id: 'dev-q1-c1',
          text: 'バイヤー（買い手企業）が手数料を負担する',
          isCorrect: true,
          complianceDelta: 5,
          gmvDelta: 10,
          uxDelta: 5,
          feedbackText: '正解。BPSPの設計の特徴はBtoC決済と逆で、手数料を買い手（バイヤー）が負担します。これにより、サプライヤーは抵抗なく導入でき、商習慣を変えずに済みます。',
        },
        {
          id: 'dev-q1-c2',
          text: 'サプライヤー（売り手企業）が手数料を負担する',
          isCorrect: false,
          complianceDelta: -5,
          gmvDelta: -5,
          uxDelta: -5,
          feedbackText: '不正解。BtoCでは売り手（加盟店）が手数料を負担しますが、BPSPは「買い手負担」が原則です。サプライヤーが高額取引の手数料を負担すると利益を圧迫するため普及しません。',
        },
        {
          id: 'dev-q1-c3',
          text: 'BPSP事業者自身が手数料相当分を負担する',
          isCorrect: false,
          complianceDelta: -5,
          gmvDelta: -10,
          uxDelta: -5,
          feedbackText: '不正解。BPSP事業者は手数料を「収受する」側です。事業として成立するためには、バイヤーから手数料を受け取る必要があります。',
        },
      ],
    },
    {
      id: 'dev-q2-l1',
      questionText: 'アクワイアラ（加盟店契約会社）から見たとき、BPSP事業者はどのように位置付けられますか？',
      sortOrder: 2,
      choices: [
        {
          id: 'dev-q2-c1',
          text: '疑似加盟店（バイヤー・サプライヤーをまとめて引き受ける加盟店類似の存在）',
          isCorrect: true,
          complianceDelta: 5,
          gmvDelta: 5,
          uxDelta: 5,
          feedbackText: '正解。BPSP事業者はアクワイアラと加盟店契約を結ぶ「疑似加盟店」として機能します。その下でバイヤーやサプライヤーが取引を行う5者構造です。',
        },
        {
          id: 'dev-q2-c2',
          text: 'イシュア（カード発行会社）と同等の機能を持つ事業者',
          isCorrect: false,
          complianceDelta: -10,
          gmvDelta: -5,
          uxDelta: -5,
          feedbackText: '不正解。イシュアはカードを発行してバイヤーに与信を提供する機能を持ちます。BPSP事業者はイシュアではなく、アクワイアラと加盟店契約を結ぶ疑似加盟店側の存在です。',
        },
        {
          id: 'dev-q2-c3',
          text: 'アクワイアリング業務を完全代行するPSP（Payment Service Provider）',
          isCorrect: false,
          complianceDelta: -5,
          gmvDelta: -5,
          uxDelta: -5,
          feedbackText: '不正解。PSPはアクワイアラの業務を代行しますが、BPSP事業者はアクワイアラと加盟店契約を結ぶ「加盟店側」の存在です。機能的な位置付けが異なります。',
        },
      ],
    },
    {
      id: 'dev-q3-l1',
      questionText: 'バイヤー（買い手企業）がBPSPを利用する最大の経済的メリットはどれですか？',
      sortOrder: 3,
      choices: [
        {
          id: 'dev-q3-c1',
          text: 'カードの支払サイクルを活用した支払繰延（実質最大60日程度）による資金繰り改善',
          isCorrect: true,
          complianceDelta: 0,
          gmvDelta: 15,
          uxDelta: 10,
          feedbackText: '正解。BPSPの最大の価値は「支払繰延」です。銀行振込で即時払いが必要な請求書をカード払いにすることで、最大60日の資金繰り改善が実現します。',
        },
        {
          id: 'dev-q3-c2',
          text: 'サービス利用料（手数料）が一切かからない点',
          isCorrect: false,
          complianceDelta: -5,
          gmvDelta: 5,
          uxDelta: -5,
          feedbackText: '不正解。BPSPを利用するバイヤーは通常2.5〜4%程度の手数料を負担します。手数料コストより資金繰り改善・ポイント還元のメリットが上回る場合に利用価値があります。',
        },
        {
          id: 'dev-q3-c3',
          text: 'サプライヤーの信用調査や与信審査が不要になる点',
          isCorrect: false,
          complianceDelta: -10,
          gmvDelta: -5,
          uxDelta: -5,
          feedbackText: '不正解。BPSPを利用しても、サプライヤーへの取引リスク管理はバイヤーの責任です。BPSPが引き受けるのは決済の仲介であり、取引先の与信審査を代行するものではありません。',
        },
      ],
    },
    {
      id: 'content-q4-l1',
      questionText: '日本企業間（BtoB）取引でキャッシュレスが浸透しなかった最大の理由として正しいものはどれですか？',
      sortOrder: 4,
      choices: [
        {
          id: 'content-q4-l1-c1',
          text: 'BtoCと同じく売り手が手数料を負担する慣行だと、高額取引で利益が吹き飛ぶため',
          isCorrect: true,
          complianceDelta: 5,
          gmvDelta: 5,
          uxDelta: 5,
          feedbackText: '正解。企業間取引は1件あたりの金額が大きく、BtoC同様に売り手が手数料を負担すると収益を圧迫します。BPSPは「買い手負担」にすることでこの問題を解決しました。',
        },
        {
          id: 'content-q4-l1-c2',
          text: '日本では法律でBtoBのカード決済が禁止されていたため',
          isCorrect: false,
          complianceDelta: -10,
          gmvDelta: -5,
          uxDelta: -5,
          feedbackText: '不正解。法律でBtoBカード決済が禁止されていたわけではありません。法的グレーゾーン（為替取引・貸金業該当性等）はありましたが、2025年の金融庁Q&AやBIPSガイドラインで整理が進んでいます。',
        },
        {
          id: 'content-q4-l1-c3',
          text: '企業間取引の金額が少額すぎてカード決済のコストに見合わないため',
          isCorrect: false,
          complianceDelta: -5,
          gmvDelta: -5,
          uxDelta: -5,
          feedbackText: '不正解。実際は逆で、企業間取引は1件あたり数万〜数千万円と高額です。日本の企業間決済は推計1,000兆円超の市場規模を持ちます。',
        },
      ],
    },
  ]

  for (const q of l1questions) {
    await prisma.quiz.upsert({
      where: { id: q.id },
      update: { question: q.questionText, sortOrder: q.sortOrder },
      create: { id: q.id, moduleId: level1.id, question: q.questionText, type: 'single_choice', sortOrder: q.sortOrder },
    })
    await prisma.quizOption.deleteMany({ where: { quizId: q.id } })
    await prisma.quizOption.createMany({
      data: q.choices.map((c) => ({ ...c, quizId: q.id })),
    })
  }
  console.log('Level 1: 5 pages, 4 questions done')

  // ── Level 2: 法規制 ───────────────────────────────────────────────────────
  const l2pages = [
    {
      pageNumber: 1,
      heading: 'BPSPに関わる主要法令マップ',
      body: 'BPSPの事業運営には複数の法令が関係します。全体像を把握することがコンプライアンスの第一歩です。\n\n■ 主要法令と関係\n・資金決済法：BPSPが「為替取引」に該当する場合は資金移動業登録が必要\n・割賦販売法：BPSPは疑似加盟店としてアクワイアラと加盟店契約を結ぶため、割販法の規律対象\n・貸金業法：BPSPの立替が「貸付けと同等の経済的効果」と判断される場合に登録必要\n・犯収法（犯罪収益移転防止法）：マネロン対策・テロ資金供与対策\n・個人情報保護法：加盟店情報・利用者情報の取扱い\n\n■ 業界自主規制（BIPS）\n2025年12月にキャッシュレス推進協議会が「請求書カード払い取引ガイドライン」を公表し、2026年6月26日施行。アクワイアラは協会未登録のBIPS事業者と加盟店契約を締結できないとされており、BIPS事業者にとって協会登録が事業継続の前提となります。',
    },
    {
      pageNumber: 2,
      heading: '資金決済法と為替取引該当性',
      body: '2025年6月に改正資金決済法が成立し、2026年中に段階的施行が予定されています。BPSP事業者が特に注意すべき点を解説します。\n\n■ 為替取引とは\n「隔地者間で資金を移動する仕組みを提供する業務」を指します。第三者である債権者（サプライヤー）への支払代行は为替取引に該当するリスクがあります。\n\n■ 回避の設計\nBPSPは「自己の名義で立替払いを行う」スキーム設計で為替取引該当性を回避するのが通例です。BIPSガイドラインでも、サプライヤーへの送金を銀行振込に限定し、物理的な現金受け渡しを禁止しています。\n\n■ 2025年改正のポイント\n・クロスボーダー収納代行（海外サプライヤーへの送金）は適用除外類型に該当しなければ資金移動業登録が必要\n・BIPSガイドラインは国内法人のみを対象（海外送金は将来検討）\n・送金方法は銀行振込のみ。サプライヤーの口座は金融機関で身元確認済みのものに限定',
    },
    {
      pageNumber: 3,
      heading: '割賦販売法とBPSPの規律',
      body: '割賦販売法はクレジット取引を規律する法律で、BPSPはその適用対象に含まれます。\n\n■ BPSPへの適用\nアクワイアラは「クレジットカード番号等取扱契約締結事業者」として登録制の下に置かれます。BPSPはアクワイアラの加盟店として機能しますが、「立替払取次業者のために加盟店に立替金を交付する事業者」に該当する可能性があります。\n\n■ セキュリティ対策義務\n割賦販売法の改正でセキュリティ対策義務の対象が拡大されました。BPSPが対象に含まれる場合、「クレジットカード・セキュリティガイドライン6.0版」への準拠が求められます。\n\n■ 実務上の対応\n・カード情報を自社で保持しない設計（非保持化・トークン化）\n・加盟店契約時のセキュリティ審査の実施\n・定期的なセキュリティ監査とPCI DSS対応の支援',
    },
    {
      pageNumber: 4,
      heading: '貸金業該当性（金融庁Q&A 2025年4月）',
      body: 'BPSPの立替払いが「貸付けと同等の経済的効果」を持つかどうかが長年の論点でした。2025年4月に金融庁が判断基準を明示しました。\n\n■ 判断の枠組み（2点を中心に総合考慮）\n① どの程度資金需要者の支払能力を補完しているか\n② どの程度資金需要者の信用力を考慮しているか\n\n■ 貸金業に近づく設計の例\n・利用者の財務状況に応じてサービス可否・手数料・利用上限を変動させている\n・月収状況の入金確認書面の提出を求めて利用上限を決めている\n・提供サービスの実態に比して手数料が高額\n\n■ 貸金業に近づきにくい設計の例\n・事務作業効率化が主目的で、立替額が少額かつ立替期間が極めて短期\n・利用者属性別の与信判断を行わず、汎用的な手数料体系\n\n⚠️ 注意：少額・短期であっても貸付けに該当する可能性は残ります。Q&Aは「将来の解釈を保証するものではない」と明記しています。',
    },
    {
      pageNumber: 5,
      heading: '犯収法・AML/KYC・BIPSガイドライン',
      body: '■ 犯収法（犯罪収益移転防止法）の概要\n金融機関等の「特定事業者」にマネロン対策・テロ資金供与対策（AML/CFT）を義務付ける法律。BPSPは特定事業者に直接該当しないケースが多いですが、関連事業者（カード会社・アクワイアラ）が義務を負い、BPSPにも実質的な対応が求められます。\n\n■ KYC・eKYC\nKYC（Know Your Customer）は加盟店・利用者の実態・本人性・事業内容を確認するプロセスです。2018年の犯収法改正でeKYC（オンライン本人確認）が認められ、ICチップ読み取り・銀行API照合・公的個人認証等の方式が利用可能になりました。\n\n■ BIPSガイドラインのポイント（2025年12月公表・2026年6月26日施行）\n・サプライヤーの範囲：国内の法人または営業性個人に限定\n・送金方法：銀行振込のみ（現金受け渡し禁止）\n・協会登録：未登録のBIPS事業者とはアクワイアラが加盟店契約を締結できない\n・違反時：登録抹消・加盟店契約解除',
    },
  ]

  for (const p of l2pages) {
    await prisma.storyPage.upsert({
      where: { levelId_pageNumber: { levelId: level2.id, pageNumber: p.pageNumber } },
      update: { contentJson: { heading: p.heading, body: p.body } },
      create: { levelId: level2.id, pageNumber: p.pageNumber, contentJson: { heading: p.heading, body: p.body } },
    })
  }

  const l2questions = [
    {
      id: 'content-q1-l2',
      questionText:
        'BPSP事業者がサプライヤーへの送金を行う際、「為替取引」該当リスクを回避するための設計として正しいものはどれですか？',
      sortOrder: 1,
      choices: [
        {
          id: 'content-q1-l2-c1',
          text: '自己の名義で立替払いを行い、送金手段は銀行振込に限定する',
          isCorrect: true,
          complianceDelta: 10,
          gmvDelta: 5,
          uxDelta: 5,
          feedbackText:
            '正解。「自己資金での立替払い」とする設計が為替取引該当性を回避する基本です。BIPSガイドラインでも銀行振込に限定し、物理的な現金受け渡しを禁止しています。',
        },
        {
          id: 'content-q1-l2-c2',
          text: '暗号資産や電子決済手段を使って即時送金を実施する',
          isCorrect: false,
          complianceDelta: -25,
          gmvDelta: 10,
          uxDelta: -5,
          feedbackText:
            '不正解。暗号資産や電子決済手段を利用した送金は、さらなる規制（暗号資産交換業等）に触れるリスクがあります。BIPSガイドラインは銀行振込のみを認めています。',
        },
        {
          id: 'content-q1-l2-c3',
          text: '法的判断が複雑なため、まず事業を開始して規制当局の判断を待つ',
          isCorrect: false,
          complianceDelta: -20,
          gmvDelta: -10,
          uxDelta: -5,
          feedbackText:
            '不正解。法的リスクを認識しながら対応を先送りすることはコンプライアンス上許容されません。規制当局への事前確認と業界自主規制への参加が求められます。',
        },
      ],
    },
    {
      id: 'content-q2-l2',
      questionText:
        '飲食店向けにBPSPサービスを提供しているとき、利用者から「中古車ディーラーへの支払い1,200万円」という申請が入りました。どう対応しますか？',
      sortOrder: 2,
      choices: [
        {
          id: 'content-q2-l2-c1',
          text: '高額かつ申込時の業種申告との不整合を確認し、追加審査を実施してから判断する',
          isCorrect: true,
          complianceDelta: 10,
          gmvDelta: -10,
          uxDelta: 5,
          feedbackText:
            '正解。高額取引・換金性の高い商品（中古車）・業種の不整合は要注意のシグナルです。安易に承認せず、追加審査を行うことが適切なリスク管理です。',
        },
        {
          id: 'content-q2-l2-c2',
          text: '取引金額が大きく事業貢献度が高いため、迅速に承認する',
          isCorrect: false,
          complianceDelta: -20,
          gmvDelta: 30,
          uxDelta: -5,
          feedbackText:
            '不正解。金額の大きさで審査を甘くすることはAML規制の観点から重大な問題です。高額取引こそ審査を厳格に行う必要があります。',
        },
        {
          id: 'content-q2-l2-c3',
          text: '申請内容に問題はないと判断し、通常の処理を進める',
          isCorrect: false,
          complianceDelta: -15,
          gmvDelta: 15,
          uxDelta: -5,
          feedbackText:
            '不正解。業種登録との不整合・高額・換金性商品という複数の警戒サインを見逃しています。このような取引は必ず追加審査が必要です。',
        },
      ],
    },
    {
      id: 'content-q3-l2',
      questionText:
        '利用者から「米国の広告プラットフォーム（外国法人）への支払い500万円」という申請が入りました。どう対応しますか？',
      sortOrder: 3,
      choices: [
        {
          id: 'content-q3-l2-c1',
          text:
            'クロスボーダー収納代行に該当する可能性があるため、資金移動業登録の要否をコンプライアンス部門に確認してから判断する',
          isCorrect: true,
          complianceDelta: 10,
          gmvDelta: -20,
          uxDelta: 0,
          feedbackText:
            '正解。2025年改正資金決済法では、クロスボーダー収納代行は適用除外類型に該当しなければ資金移動業登録が必要です。BIPSガイドラインも国内法人への送金のみを対象としています。',
        },
        {
          id: 'content-q3-l2-c2',
          text: '海外送金も通常業務の範囲内と判断し、すぐに承認する',
          isCorrect: false,
          complianceDelta: -100,
          gmvDelta: 50,
          uxDelta: -20,
          feedbackText:
            'ゲームオーバー。クロスボーダー収納代行を無登録で行うことは資金決済法違反です。発覚すれば業務停止・行政処分のリスクがあります。コンプライアンス = 0。',
        },
        {
          id: 'content-q3-l2-c3',
          text: 'コンプライアンス部門に確認せず、担当営業の判断に委ねる',
          isCorrect: false,
          complianceDelta: -30,
          gmvDelta: 10,
          uxDelta: -5,
          feedbackText:
            '不正解。法的グレーゾーンの判断を営業担当だけに委ねることは不適切です。コンプライアンス・法務部門への即時エスカレーションが必要です。',
        },
      ],
    },
    {
      id: 'content-q4-l2',
      questionText:
        '金融庁Q&A（2025年4月）によると、BPSPサービスの設計で「貸金業に該当するリスクを高める」要素はどれですか？',
      sortOrder: 4,
      choices: [
        {
          id: 'content-q4-l2-c1',
          text: '利用者の財務状況に応じてサービス可否・手数料・利用上限額を変動させている設計',
          isCorrect: true,
          complianceDelta: 10,
          gmvDelta: 5,
          uxDelta: 5,
          feedbackText:
            '正解。金融庁Q&AはBPSPが「利用者の支払能力を補完」「信用力を考慮」していると判断される場合に貸金業に近づくとしています。利用者属性別の与信判断がその典型例です。',
        },
        {
          id: 'content-q4-l2-c2',
          text: 'すべての利用者に一律の手数料率を適用している設計',
          isCorrect: false,
          complianceDelta: -10,
          gmvDelta: -5,
          uxDelta: -5,
          feedbackText:
            '不正解。一律手数料率は「利用者の信用力を考慮していない」ことを示すため、貸金業該当リスクを下げる設計です。',
        },
        {
          id: 'content-q4-l2-c3',
          text: '立替期間が数日と短く、事務効率化を主目的とした設計',
          isCorrect: false,
          complianceDelta: -5,
          gmvDelta: -5,
          uxDelta: -5,
          feedbackText:
            '不正解。短期・少額の立替で事務作業効率化が主目的の設計は、貸金業に近づきにくいとされています。',
        },
      ],
    },
  ]

  for (const q of l2questions) {
    await prisma.quiz.upsert({
      where: { id: q.id },
      update: { question: q.questionText, sortOrder: q.sortOrder },
      create: { id: q.id, moduleId: level2.id, question: q.questionText, type: 'single_choice', sortOrder: q.sortOrder },
    })
    await prisma.quizOption.deleteMany({ where: { quizId: q.id } })
    await prisma.quizOption.createMany({
      data: q.choices.map((c) => ({ ...c, quizId: q.id })),
    })
  }
  console.log('Level 2: 5 pages, 4 questions done')

  // ── Level 3: 実務・システム ────────────────────────────────────────────────
  const l3pages = [
    {
      pageNumber: 1,
      heading: 'オーソリ・クリアリング・セツルメントの3段階',
      body: 'クレジットカード決済の裏側では、大きく3段階の処理が動いています。BPSPでもバイヤーのカード利用部分はこの流れに従います。\n\n■ 3つの処理\n① オーソリゼーション（信用照会）\n加盟店からイシュアにリアルタイムで「このカードでこの金額を使ってよいか」を照会。カードの有効期限切れ・紛失盗難・与信枠超過をチェック。承認結果が数秒で返ります。\n\n② クリアリング（売上処理）\n売上金額を確定し、加盟店→アクワイアラ→（国際ブランドネットワーク経由）→イシュアへ売上請求。\n\n③ セツルメント（決済・清算）\nアクワイアラから加盟店への入金、イシュアからアクワイアラへの請求金額の送金。\n\n■ BPSPの特徴\nオーソリは数秒、クリアリング・セツルメントは通常数営業日かかります。BPSPでは加盟店＝BPSP事業者となり、BPSPからサプライヤーへの銀行振込はクリアリング処理とは別タイミングで実行されます。',
    },
    {
      pageNumber: 2,
      heading: '加盟店審査の実務と注意点',
      body: 'BPSPは「疑似加盟店」としてアクワイアラと加盟店契約を結ぶため、BPSP自身の加盟店審査だけでなく、配下で利用するバイヤー・サプライヤーの審査も実施する必要があります。\n\n■ 典型的な審査項目\n・法人格・事業実態の確認\n・反社チェック（暴排条項適用）\n・主要取引先・取扱商材の確認（換金性が高い商品の取扱有無）\n・売上規模・財務状況\n・過去のチャージバック実績\n\n■ 特に注意すべき取引\n・ギャンブル関連、アダルト関連（カードブランドルールで禁止または制限）\n・高換金性商品（金券、貴金属、ブランド品の流通）\n・自己決済（自社のカードで自社請求書を支払うことで実質的な現金化を試みる）\n・マネロン疑い取引（金額が異常に高額・頻度が高い・第三者口座への振込指示）',
    },
    {
      pageNumber: 3,
      heading: 'PCI DSS（カード情報セキュリティ基準）',
      body: 'PCI DSS（Payment Card Industry Data Security Standard）はカード会員データを取り扱うすべての事業者に求められる国際的なセキュリティ基準です。\n\n■ 概要\n・6目標・12要件・約400の管理項目で構成\n・カード情報を取り扱う事業者は準拠が義務\n・割賦販売法の「必要かつ適切な措置」と連動\n\n■ BPSPが取るべき最善策：非保持化\nカード情報を自社システムで直接保持しない設計（トークン化、決済代行サービス経由）が望ましいです。自社でカード情報を保持する場合、PCI DSSへの完全準拠・維持コストは膨大になります。\n\n■ 割販法との関係\n「クレジットカード・セキュリティガイドライン6.0版」への準拠が、割販法の「必要かつ適切な措置」を講じたとみなされます。BPSPが割販法の対象に含まれる場合は、このガイドラインへの準拠が求められます。',
    },
    {
      pageNumber: 4,
      heading: '入金消込の仕組みと課題',
      body: '入金消込とは、自社の請求情報と銀行口座への入金実績を突合（マッチング）し、売掛金を消し込む経理業務です。\n\n■ 従来の課題（なぜ消込が難しいか）\n・振込人名義と請求先企業名の不一致（略称・代表者名義・グループ会社名義）\n・分割振込・複数請求の一括振込\n・振込手数料の控除\n・過入金・消費税端数差額\n\n■ BPSPの実務的価値\nBPSPからの入金は振込名義を指定できることが多く、サプライヤーにとって消込しやすいのが特徴です。ただし、サプライヤーがBPSPの存在を知らない場合、「見覚えのない振込人名」で逆に消込が困難になるケースもあります。\n\n■ 自動化技術\n・銀行API（電子決済等代行業者経由）で入出金明細を自動取得\n・AI-OCRで請求書を読み取り、入金データと自動突合\n・改正銀行法（2018年）でオープンAPI整備が進み、電子決済等代行業者の登録制が導入',
    },
    {
      pageNumber: 5,
      heading: 'キャッシュフロー（CF）管理',
      body: 'BPSPはバイヤー・サプライヤー双方のキャッシュフローに影響を与え、BPSP事業者自身にもCF管理が必要です。\n\n■ バイヤー視点のCF\n・通常の銀行振込：支払期日に即時資金流出\n・BPSP利用時：支払期日にBPSPが立替 → カード締め日 → カード支払日（最大60日後）に資金流出\n→ キャッシュアウトタイミングの後ろ倒し＝短期運転資金の確保\n\n■ サプライヤー視点のCF\n・入金タイミングは原則として変わらない（請求書の支払期日に振込）\n・BPSPによっては「即日振込」「翌日振込」プランがあり、早期入金も可能\n\n■ BPSP事業者自身のCF管理\n・バイヤー請求とイシュア入金のタイムラグを埋めるため、自社の運転資金が必要\n・GMV（取扱高）拡大には資本コストの確保が前提\n・取扱高拡大＝収益拡大ですが、同時に立替資金需要・与信ロスリスクも増加',
    },
  ]

  for (const p of l3pages) {
    await prisma.storyPage.upsert({
      where: { levelId_pageNumber: { levelId: level3.id, pageNumber: p.pageNumber } },
      update: { contentJson: { heading: p.heading, body: p.body } },
      create: { levelId: level3.id, pageNumber: p.pageNumber, contentJson: { heading: p.heading, body: p.body } },
    })
  }

  const l3questions = [
    {
      id: 'content-q1-l3',
      questionText:
        'ダッシュボードに「未消込売掛金 12件、合計 458万円」と表示されています。原因として最も可能性が高いものはどれですか？',
      sortOrder: 1,
      choices: [
        {
          id: 'content-q1-l3-c1',
          text: '振込人名義が請求先企業名と異なっているため、自動突合ができない',
          isCorrect: true,
          complianceDelta: 0,
          gmvDelta: 5,
          uxDelta: 10,
          feedbackText:
            '正解。入金消込で最も多い問題は「振込人名義の不一致」です。略称・代表者名義・グループ会社名義での振込が自動突合を妨げます。BPSPからの入金では振込名義を指定できますが、サプライヤーが見覚えのない名義を受け取るケースもあります。',
        },
        {
          id: 'content-q1-l3-c2',
          text: 'PCI DSS監査の不適合により取引処理が停止している',
          isCorrect: false,
          complianceDelta: -20,
          gmvDelta: -15,
          uxDelta: -10,
          feedbackText:
            '不正解。PCI DSS監査の不適合は入金消込の件数・合計額という形で現れる問題ではありません。カード情報セキュリティの問題は別途対処が必要ですが、この症状の主因ではありません。',
        },
        {
          id: 'content-q1-l3-c3',
          text: '取引先の倒産により入金が止まった',
          isCorrect: false,
          complianceDelta: -5,
          gmvDelta: -20,
          uxDelta: -10,
          feedbackText:
            '不正解。取引先の倒産で入金が止まるケースは存在しますが、「12件・458万円」という複数件の未消込は、振込人名義の不一致のような日常的な運用上の問題のほうが頻度として高いです。',
        },
      ],
    },
    {
      id: 'content-q2-l3',
      questionText:
        'BPSP事業者がカード情報（カード番号・有効期限等）を適切に扱うための最善策はどれですか？',
      sortOrder: 2,
      choices: [
        {
          id: 'content-q2-l3-c1',
          text:
            'カード情報を自社システムで直接保持せず、トークン化・決済代行サービスを活用して非保持化する',
          isCorrect: true,
          complianceDelta: 10,
          gmvDelta: 5,
          uxDelta: 10,
          feedbackText:
            '正解。PCI DSSはカード情報を取り扱うすべての事業者に適用されます。最善策は「非保持化」——カード情報を自社に残さず、トークンに置き換えることです。',
        },
        {
          id: 'content-q2-l3-c2',
          text: 'カード情報を自社のセキュリティ強化されたデータベースに暗号化して保存する',
          isCorrect: false,
          complianceDelta: -20,
          gmvDelta: 5,
          uxDelta: -5,
          feedbackText:
            '不正解。暗号化はPCI DSSの一要素ですが、「保存する」自体がリスクです。PCI DSS準拠には約400の管理項目があり、準拠・維持コストは膨大です。非保持化のほうが現実的で安全です。',
        },
        {
          id: 'content-q2-l3-c3',
          text: 'カード情報の取扱いはアクワイアラの責任なので、自社では特段の対応は不要',
          isCorrect: false,
          complianceDelta: -30,
          gmvDelta: -10,
          uxDelta: -15,
          feedbackText:
            '不正解。割賦販売法の改正により、BPSPが対象に含まれる場合はカード情報セキュリティ対策の義務対象です。アクワイアラ任せにすることは許されません。',
        },
      ],
    },
    {
      id: 'content-q3-l3',
      questionText:
        'BPSP事業者のキャッシュフロー管理上、最も重要な認識はどれですか？',
      sortOrder: 3,
      choices: [
        {
          id: 'content-q3-l3-c1',
          text:
            'GMV（取扱高）の拡大には運転資金・資本コストの確保が前提であり、収益より先に資金繰りが悪化するリスクがある',
          isCorrect: true,
          complianceDelta: 5,
          gmvDelta: 10,
          uxDelta: 5,
          feedbackText:
            '正解。BPSPはバイヤーへ立替払いをして後でカード会社から回収するモデルです。取扱高が増えるほど先に立替資金が必要になります。資本コスト管理なしの拡大は財務的危機を招きます。',
        },
        {
          id: 'content-q3-l3-c2',
          text: 'GMV拡大は常に収益拡大を意味するため、積極的に拡大すれば資金繰りは自然に改善する',
          isCorrect: false,
          complianceDelta: -10,
          gmvDelta: 20,
          uxDelta: -5,
          feedbackText:
            '不正解。GMV拡大は収益機会ですが、同時に立替資金需要・与信ロスリスク・管理コストも増加します。資本コストを無視した拡大は財務的危機を招きます。',
        },
        {
          id: 'content-q3-l3-c3',
          text: 'サプライヤーへの入金はカード会社からの回収後に設定すれば資金繰りリスクはゼロになる',
          isCorrect: false,
          complianceDelta: -5,
          gmvDelta: -10,
          uxDelta: -15,
          feedbackText:
            '不正解。回収後入金ではBPSPの「立替払い」という事業モデルの本質が失われます。サプライヤーへの迅速な入金がBPSPの価値の一部であり、回収前の立替を前提とした資本管理が必要です。',
        },
      ],
    },
  ]

  for (const q of l3questions) {
    await prisma.quiz.upsert({
      where: { id: q.id },
      update: { question: q.questionText, sortOrder: q.sortOrder },
      create: { id: q.id, moduleId: level3.id, question: q.questionText, type: 'single_choice', sortOrder: q.sortOrder },
    })
    await prisma.quizOption.deleteMany({ where: { quizId: q.id } })
    await prisma.quizOption.createMany({
      data: q.choices.map((c) => ({ ...c, quizId: q.id })),
    })
  }
  console.log('Level 3: 5 pages, 3 questions done')

  // ── Level 4: 営業・提案 ───────────────────────────────────────────────────
  const l4pages = [
    {
      pageNumber: 1,
      heading: 'BPSPの2軸顧客とターゲット設計',
      body: 'BPSPは「バイヤー獲得」と「アクワイアラ・パートナー獲得」の2軸でビジネスが成立します。\n\n■ バイヤー側の登場人物（決裁プロセス）\n・CFO / 経理財務責任者：資金繰り・コスト効率・コンプライアンスを重視\n・購買部長 / 調達責任者：取引先関係維持・支払業務効率を重視\n・経理担当者 / 経費精算担当：日々の運用負担・システム連携を重視\n・情報システム部門：セキュリティ・既存システム連携・運用保守\n\n■ 複数の関係者が意思決定に関与\n大企業への導入では、経理・購買・IT・財務の各部門が関与します。「誰にどのメッセージを届けるか」を明確にしなければ、稟議が通りません。\n\n■ チャンピオン（社内推進者）の重要性\nBtoBセールスでは、顧客企業内で自社プロダクトを推進してくれるキーパーソン（チャンピオン）を育てることが、決裁プロセスを動かす鍵です。',
    },
    {
      pageNumber: 2,
      heading: 'ROI訴求の構造',
      body: 'BPSPの典型的なROI訴求は「カード手数料コスト ＜ 資金繰り改善メリット ＋ ポイント還元 ＋ 業務効率化」という構造です。\n\n■ 典型的なBPSP手数料\n2.5〜4%程度（サービスにより異なる）\n\n■ バイヤー側の収益化メリット\n① ポイント還元：1%還元なら手数料2.5%の場合、実質負担1.5%相当\n② 資金繰り改善：最大60日繰延 → 短期借入金利（年利3%なら60日分＝約0.5%）と比較\n③ 業務効率化：振込手数料削減、経理工数削減（請求書1枚あたりの処理時間×件数）\n④ 支払一元化：電子帳簿保存法・インボイス制度対応の効率化\n\n■ 訴求の落とし穴\n・「カード手数料を売り手に転嫁できない」ため、買い手側が手数料を負担する前提\n・ポイント還元目当てだけだと、手数料を払って小さな還元を得るだけになりがち\n・資金繰り改善メリットは財務余力のある大企業には刺さりにくい → 業務効率化訴求に切り替える',
    },
    {
      pageNumber: 3,
      heading: '典型的な反対意見と対応',
      body: '■ 主な反対意見と対応策\n\n「手数料を払ってまでカード払いする意味がない」\n→ ポイント還元・資金繰り改善の定量試算を提示。短期借入金利との比較\n\n「経理処理が複雑になるのでは」\n→ 既存会計システムとのAPI連携、電子帳簿保存法対応、自動仕訳機能\n\n「取引先（サプライヤー）に迷惑がかかるのでは」\n→ 振込名義を指定可能、サプライヤーには通常の銀行振込として着金、商習慣不変\n\n「セキュリティが心配」\n→ PCI DSS準拠、クレジットカード・セキュリティガイドライン遵守、トークン化\n\n「ファクタリングとの違いは？」\n→ ファクタリングは売掛債権の譲渡（売り手向け）。BPSPは買い手の支払繰延（買い手向け）。資金繰り改善の方向が逆\n\n「貸金業に該当しないのか」\n→ 金融庁Q&A（2025年4月）に基づき、立替期間・手数料体系・与信運用の設計で適法性を確保',
    },
    {
      pageNumber: 4,
      heading: 'BtoBセールスプロセス',
      body: '■ 6ステップのセールスプロセス\n\n① 顧客理解\nペルソナ設計（業種・職種・課題・KPI）とカスタマージャーニー（興味→検討→決裁）\n\n② アプローチ\n担当者ではなく決裁者へリーチ。社内に「チャンピオン」を育てることで決裁プロセスを内側から動かす\n\n③ 価値提示\n経理部門向け・現場向け・経営層向けに資料を出し分ける（ROIシミュレーション・業務フロー・エグゼクティブサマリー）\n\n④ 比較段階\n「比較される前提」で他社との差別化材料を準備（手数料率・振込速度・対応ブランド・サポート品質）\n\n⑤ 稟議支援\n社内稟議に必要な情報を先回りで提供（導入効果・セキュリティ・費用対効果）\n\n⑥ クロージング\n不安要素を解消する個別Q&A、トライアル提案',
    },
  ]

  for (const p of l4pages) {
    await prisma.storyPage.upsert({
      where: { levelId_pageNumber: { levelId: level4.id, pageNumber: p.pageNumber } },
      update: { contentJson: { heading: p.heading, body: p.body } },
      create: { levelId: level4.id, pageNumber: p.pageNumber, contentJson: { heading: p.heading, body: p.body } },
    })
  }

  const l4questions = [
    {
      id: 'content-q1-l4',
      questionText:
        'CFOから「銀行借入で十分資金繰りはできているし、3%の手数料を払うほどのメリットを感じない」と言われました。最も効果的な次のアプローチはどれですか？',
      sortOrder: 1,
      choices: [
        {
          id: 'content-q1-l4-c1',
          text:
            '「資金繰りではなく、購買・経理業務の工数削減に大きな効果があります。御社の月間振込件数で試算すると…」と業務効率の定量化を提示する',
          isCorrect: true,
          complianceDelta: 5,
          gmvDelta: 15,
          uxDelta: 10,
          feedbackText:
            '正解。資金繰りに困っていないCFOには「コスト削減・業務効率化」の訴求が効果的です。振込手数料削減・経理工数削減・電帳法対応の定量試算を提示することがポイントです。',
        },
        {
          id: 'content-q1-l4-c2',
          text: '「ポイント還元で実質1.5%程度の負担になります」とポイントメリットを強調する',
          isCorrect: false,
          complianceDelta: 0,
          gmvDelta: 5,
          uxDelta: -5,
          feedbackText:
            '惜しいですが効果が薄いです。ポイント還元はCFOにはあまり刺さりません。会社の経費でポイントを獲得することへの感度は個人より低く、財務責任者へのメインメッセージには不向きです。',
        },
        {
          id: 'content-q1-l4-c3',
          text: '「では競合他社も検討されているかもしれませんので、特別価格をご提示します」と価格交渉に応じる',
          isCorrect: false,
          complianceDelta: -5,
          gmvDelta: -10,
          uxDelta: -10,
          feedbackText:
            '不正解。顧客の真の課題（ROI不明確）を解決せずに値引きに走ることは商談の主導権を失い、後の関係性にも悪影響を与えます。',
        },
      ],
    },
    {
      id: 'content-q2-l4',
      questionText:
        '顧客から「ファクタリングと何が違うのですか？」と質問されました。最も正確な説明はどれですか？',
      sortOrder: 2,
      choices: [
        {
          id: 'content-q2-l4-c1',
          text:
            'ファクタリングは売り手が売掛債権を売却して早期回収する仕組み（売り手向け）、BPSPは買い手が支払いを繰り延べる仕組み（買い手向け）で、資金繰り改善の方向が逆',
          isCorrect: true,
          complianceDelta: 5,
          gmvDelta: 10,
          uxDelta: 10,
          feedbackText:
            '正解。ファクタリング（売掛債権の譲渡）とBPSP（支払繰延）は資金改善の方向が逆です。顧客がどちらが自社に合うかを判断できるよう、正確な説明が信頼構築につながります。',
        },
        {
          id: 'content-q2-l4-c2',
          text: 'ファクタリングは違法なグレーゾーン商品であり、BPSPのほうが安全で合法的な選択肢',
          isCorrect: false,
          complianceDelta: -20,
          gmvDelta: -5,
          uxDelta: -20,
          feedbackText:
            '不正解。ファクタリングは適法なサービスです。誤った情報で競合を中傷することは信頼を損ない、法的リスクも生じます。',
        },
        {
          id: 'content-q2-l4-c3',
          text: 'BPSPもファクタリングも本質的には同じサービスで、呼び方が異なるだけ',
          isCorrect: false,
          complianceDelta: -5,
          gmvDelta: -5,
          uxDelta: -10,
          feedbackText:
            '不正解。両者は対象（売り手 vs 買い手）・仕組み（債権譲渡 vs カード決済）・コスト構造が根本的に異なります。同じと説明することは顧客の理解を妨げます。',
        },
      ],
    },
    {
      id: 'content-q3-l4',
      questionText:
        '大企業へのBPSP導入を進める際、「社内チャンピオン（推進者）を育てる」ことが重要とされている主な理由はどれですか？',
      sortOrder: 3,
      choices: [
        {
          id: 'content-q3-l4-c1',
          text:
            '大企業の決裁プロセスは複雑で、外部の営業担当が直接アクセスできない意思決定者を社内から動かすキーパーソンが必要なため',
          isCorrect: true,
          complianceDelta: 5,
          gmvDelta: 15,
          uxDelta: 10,
          feedbackText:
            '正解。大企業の稟議・決裁プロセスは複雑で、外部の営業だけでは進められません。現場担当者をチャンピオンに育て、社内を動かしてもらうことが長期的な関係構築と成約率向上の鍵です。',
        },
        {
          id: 'content-q3-l4-c2',
          text: '社内チャンピオンが稟議書を代わりに作成してくれるため、営業の手間が省けるから',
          isCorrect: false,
          complianceDelta: -5,
          gmvDelta: 5,
          uxDelta: -10,
          feedbackText:
            '不正解。チャンピオンの役割は「書類作成の代行」ではなく「社内の推進力」です。稟議支援は営業がしっかり行うべきものです。',
        },
        {
          id: 'content-q3-l4-c3',
          text: '社内チャンピオンを通じて競合他社の提案内容や価格情報を収集できるから',
          isCorrect: false,
          complianceDelta: -15,
          gmvDelta: -5,
          uxDelta: -20,
          feedbackText:
            '不正解。顧客の信頼関係を競合情報収集に利用することは、倫理的にも信頼構築の観点でも問題があります。チャンピオンとの関係は相互に誠実であるべきです。',
        },
      ],
    },
  ]

  for (const q of l4questions) {
    await prisma.quiz.upsert({
      where: { id: q.id },
      update: { question: q.questionText, sortOrder: q.sortOrder },
      create: { id: q.id, moduleId: level4.id, question: q.questionText, type: 'single_choice', sortOrder: q.sortOrder },
    })
    await prisma.quizOption.deleteMany({ where: { quizId: q.id } })
    await prisma.quizOption.createMany({
      data: q.choices.map((c) => ({ ...c, quizId: q.id })),
    })
  }
  console.log('Level 4: 4 pages, 3 questions done')

  // ── Level 5: BizDev・戦略 ─────────────────────────────────────────────────
  const l5pages = [
    {
      pageNumber: 1,
      heading: 'Embedded Finance（組込型金融）とBPSPの接点',
      body: 'Embedded Financeとは、非金融企業が自社のプロダクトに決済・融資・保険・投資等の金融機能をシームレスに組み込む仕組みです。\n\n■ 3者構造\n① Brand：ユーザーへのサービス提供者（非金融事業者）\n② License Holder：金融機能を提供するライセンス保有者（銀行・資金移動業者・カード会社）\n③ Enabler：BrandとLicense Holderを技術的につなぐAPI事業者\n\n■ BaaSとの関係\n・BaaS（Banking as a Service）はLicense Holder側の機能提供形態\n・Embedded FinanceはBrand側の活用形態\n・両者は表裏一体\n\n■ BPSPとの接点\n会計SaaS・請求書SaaS・ERPが自社プロダクトにBPSP機能を組み込むことで、「会計ソフトの中で請求書を見ながらカード払いできる」体験を実現します。業界特化型（建設業向け・医療業界向け・フリーランス向け等）のEmbedded Finance型BPSPが今後の成長領域です。',
    },
    {
      pageNumber: 2,
      heading: 'Unit Economics（ユニットエコノミクス）',
      body: 'Unit Economicsは事業の経済性を1ユニット（顧客1社）あたりで測定する考え方です。\n\n■ 主要指標\n・LTV（顧客生涯価値）：取扱高×テイクレート×継続年数\n　例：年間GMV 1,200万円 × テイクレート3% × 5年継続 = LTV 180万円\n・CAC（顧客獲得コスト）：獲得関連費用総額 ÷ 新規顧客数\n・LTV/CAC比：3以上が健全目安（フィンテックは5以上が理想）\n・Payback Period（投資回収期間）：12ヶ月以内が業界中央値\n\n■ テイクレート\n売上 ÷ GMV。プラットフォームの実質手数料率。BPSPでは2.5〜4%程度。\n\n■ BPSPのUnit Economics上の注意点\n・取扱高拡大に比例して資本コスト・与信ロスコストも増加\n・LTVは将来の不確定要素を含む推計値\n・加盟店審査・コンプライアンス対応コストも単位コストに含めて評価が必要',
    },
    {
      pageNumber: 3,
      heading: 'アライアンス戦略の典型パターン',
      body: 'BPSPのBizDev（事業開発）において、アライアンス（提携）戦略は事業成長の重要な柱です。\n\n■ 6つの典型パターン\n① 国際カードブランドとの連携\nBPSPスキームそのものをブランドが提供。BPSP事業者はブランドの認定を受けて運営。\n\n② アクワイアラとの連携\n加盟店契約の締結、決済処理の委託。\n\n③ 会計SaaS・請求書SaaSとの連携\nAPI連携によりEmbedded Finance化。会計ソフト内で請求書管理→カード決済→自動仕訳まで完結。\n\n④ 業界特化プラットフォームとの連携\n建設業・医療業・フリーランス向け等、業種特化型サービスへのBPSP機能組み込み。\n\n⑤ 金融機関との連携\n銀行が自社カードのBPSP対応を進める動き。ファクタリング・短期融資との組み合わせ。\n\n⑥ ERP・販売管理システムとの連携\n大企業の購買システム・経費精算システムへの組み込み。',
    },
    {
      pageNumber: 4,
      heading: '市場規模・政策動向と今後の展望',
      body: '■ キャッシュレス全体（2025年）\n・キャッシュレス決済比率：58.0%（新指標）\n・決済額：162.7兆円\n・内訳：クレジットカード82.7%（134.6兆円）、コード決済10.2%、電子マネー3.7%\n・政府目標：2030年65%、将来的に80%\n\n■ 企業間決済市場\n・推計1,000兆円超（NTTデータ経営研究所）\n・家計の民間最終消費支出（約322兆円）の3倍以上\n・大半がいまだ紙の請求書・銀行振込ベース\n・BtoBキャッシュレス化は次の最大フロンティア\n\n■ 政策動向\n・経済産業省「キャッシュレス推進検討会」（2025年10月〜）：2026年以降の中間目標策定\n・2024年に「キャッシュレス比率40%」を1年前倒しで達成\n・次の目標として2030年65%を設定\n・BtoB領域のキャッシュレス化が次の政策的焦点\n・BIPSガイドライン施行（2026年6月26日）で業界ルール整備が本格化',
    },
  ]

  for (const p of l5pages) {
    await prisma.storyPage.upsert({
      where: { levelId_pageNumber: { levelId: level5.id, pageNumber: p.pageNumber } },
      update: { contentJson: { heading: p.heading, body: p.body } },
      create: { levelId: level5.id, pageNumber: p.pageNumber, contentJson: { heading: p.heading, body: p.body } },
    })
  }

  const l5questions = [
    {
      id: 'content-q1-l5',
      questionText:
        'BPSPビジネスのUnit Economicsを評価する際、LTV/CAC比の「健全とされる目安」として正しい数値はどれですか？',
      sortOrder: 1,
      choices: [
        {
          id: 'content-q1-l5-c1',
          text: '3以上（フィンテック業界では5以上が理想とされる）',
          isCorrect: true,
          complianceDelta: 5,
          gmvDelta: 15,
          uxDelta: 5,
          feedbackText:
            '正解。LTV/CAC比3以上が業界標準の健全目安です。例：年間GMV 1,200万円×テイクレート3%×5年継続=LTV 180万円、CAC 60万円ならLTV/CAC=3.0。フィンテックでは5以上を目指すケースも多いです。',
        },
        {
          id: 'content-q1-l5-c2',
          text: '1以上（回収できていれば事業として成立する）',
          isCorrect: false,
          complianceDelta: -10,
          gmvDelta: 10,
          uxDelta: -5,
          feedbackText:
            '不正解。LTV/CAC比が1では、コスト回収ができるだけで事業の持続的な成長余地がありません。投資家・経営者は通常3以上を求めます。',
        },
        {
          id: 'content-q1-l5-c3',
          text: '0.5以上（初期投資段階では半分回収できれば許容範囲）',
          isCorrect: false,
          complianceDelta: -15,
          gmvDelta: 5,
          uxDelta: -10,
          feedbackText:
            '不正解。LTV/CAC比が0.5未満は投資した顧客獲得コストを半分も回収できない状態です。資本を食い潰す構造で、事業の継続自体が困難になります。',
        },
      ],
    },
    {
      id: 'content-q2-l5',
      questionText:
        '「Embedded Finance型BPSP」として今後の成長領域として最も有力なのはどれですか？',
      sortOrder: 2,
      choices: [
        {
          id: 'content-q2-l5-c1',
          text:
            '会計SaaSや業界特化型プラットフォームにBPSP機能を組み込み、ユーザーがサービス内でシームレスに請求書カード払いできる体験を実現する',
          isCorrect: true,
          complianceDelta: 5,
          gmvDelta: 20,
          uxDelta: 10,
          feedbackText:
            '正解。Embedded Financeの本質は「金融機能の非金融サービスへの組み込み」です。会計SaaSや業界特化プラットフォームへの統合で、BPSPは「別のサービス」ではなく「当たり前の機能」になります。スイッチングコストが高くLTV向上にも効果的です。',
        },
        {
          id: 'content-q2-l5-c2',
          text: '全業種・全規模に対応する独立したBPSPプラットフォームとして水平展開する',
          isCorrect: false,
          complianceDelta: 0,
          gmvDelta: 10,
          uxDelta: -5,
          feedbackText:
            '水平展開も可能ですが、Embedded Financeの観点では業界特化型組み込みのほうがスイッチングコストが高く、LTV向上・チャーン低下につながります。',
        },
        {
          id: 'content-q2-l5-c3',
          text: 'BtoCの個人向け後払い（BNPL）市場に参入してBtoBとBtoCを統合する',
          isCorrect: false,
          complianceDelta: -10,
          gmvDelta: 10,
          uxDelta: -5,
          feedbackText:
            '不正解。BtoBとBtoCでは規制・リスク管理・顧客特性が大きく異なります。BtoBに特化したBPSPがBtoC BNPLに安易に参入することは、コンプライアンス・事業リスクともに高い判断です。',
        },
      ],
    },
    {
      id: 'content-q3-l5',
      questionText:
        '日本の企業間決済（BtoB決済）市場の規模感として最も正確な記述はどれですか？',
      sortOrder: 3,
      choices: [
        {
          id: 'content-q3-l5-c1',
          text:
            '推計1,000兆円超で、国内の家計消費（約322兆円）の3倍以上。大半が今も銀行振込・紙の請求書ベース',
          isCorrect: true,
          complianceDelta: 5,
          gmvDelta: 15,
          uxDelta: 5,
          feedbackText:
            '正解。企業間決済は1,000兆円超という巨大市場で、BtoCキャッシュレス（162.7兆円）の6倍以上の規模があります。その大半がキャッシュレス化されていない点がBPSPの巨大な事業機会です。',
        },
        {
          id: 'content-q3-l5-c2',
          text: '約150兆円程度で、BtoC決済市場と同規模',
          isCorrect: false,
          complianceDelta: -5,
          gmvDelta: -5,
          uxDelta: -5,
          feedbackText:
            '不正解。企業間決済は個人消費を大幅に上回る規模です。BtoC決済（162.7兆円）と同規模という認識では、事業機会の大きさを大幅に過小評価しています。',
        },
        {
          id: 'content-q3-l5-c3',
          text: '約500兆円程度で、キャッシュレス化は着実に進んでいるため追加の市場機会は限定的',
          isCorrect: false,
          complianceDelta: -5,
          gmvDelta: -5,
          uxDelta: -5,
          feedbackText:
            '不正解。規模の過小評価（実際は1,000兆円超）と、キャッシュレス化進展の過大評価の両方が誤りです。企業間決済のキャッシュレス化は始まったばかりで、急成長の余地が大きいです。',
        },
      ],
    },
  ]

  for (const q of l5questions) {
    await prisma.quiz.upsert({
      where: { id: q.id },
      update: { question: q.questionText, sortOrder: q.sortOrder },
      create: { id: q.id, moduleId: level5.id, question: q.questionText, type: 'single_choice', sortOrder: q.sortOrder },
    })
    await prisma.quizOption.deleteMany({ where: { quizId: q.id } })
    await prisma.quizOption.createMany({
      data: q.choices.map((c) => ({ ...c, quizId: q.id })),
    })
  }
  console.log('Level 5: 4 pages, 3 questions done')

  console.log('\n✅ seed-content completed:')
  console.log('  - All 5 levels set to isPublished=true')
  console.log('  - Level 1: 5 pages, 4 questions (3 dev questions updated + 1 new)')
  console.log('  - Level 2: 5 pages, 4 questions')
  console.log('  - Level 3: 5 pages, 3 questions')
  console.log('  - Level 4: 4 pages, 3 questions')
  console.log('  - Level 5: 4 pages, 3 questions')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
