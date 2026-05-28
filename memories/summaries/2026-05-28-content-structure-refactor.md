# 仕様変更指示書 — コンテンツ構造拡張・クイズ強化・座学会話形式化

> **この指示書を `plans/2026-05-28-content-structure-refactor.md` として保存し、Orchestratorは本ファイルをタスク起動の根拠として扱うこと。**
> 作成者: プロジェクトオーナー
> 作成日: 2026-05-28
> 優先度: High

---

## 0. 変更の背景と目的

MVP完了後のテストプレイフィードバックを受けて以下の方針変更を行う。

1. コンテンツ構造を **Course / Module / Unit の3層** に変更し、BPSP以外の決済領域（QRコード決済・カード基礎等）を将来追加できる拡張性を確保する
2. 座学（F003）の体験を **先生・生徒の会話形式**に刷新する
3. クイズ（F004-F006）を **常時ランダム出題**に変更し、問題数を各Level12問に増強する
4. **専門家レビューは不要** とする。コンテンツは `isPublished = true` で即公開可能とする（`feature_list.json` のF009〜F013のBLOCKED状態を解除すること）

---

## 1. タスク分解と実施順序

**以下の順番を厳守すること。後続タスクは前タスクのCOMPLETE確認後に開始する。**

```
TASK-A: Prismaスキーマ変更 & マイグレーション
  ↓ COMPLETE確認
TASK-B: クイズシードデータ投入
  ↓ COMPLETE確認
TASK-C: 座学UIの会話形式化
  ↓ COMPLETE確認
TASK-D: クイズエンジンのランダム出題対応
  ↓ COMPLETE確認
TASK-E: feature_list.json の更新
```

---

## TASK-A: Prismaスキーマ変更 & マイグレーション

### 担当エージェント
Implementer（コア変更を含むため、着手前に `core/.clauderules` を確認すること）

### 変更概要
既存のコンテンツ管理テーブルを **Course / Module / Unit / Quiz / QuizOption** の構造に変更する。

### 追加・変更するモデル

```prisma
// ── 追加: コース（学習領域単位） ──
model Course {
  id          String   @id @default(cuid())
  slug        String   @unique  // 例: "bpsp", "qr-payment"
  title       String
  description String?
  isPublished Boolean  @default(false)
  order       Int      @default(0)
  modules     Module[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ── 変更: 既存Levelテーブルを Module に改名・拡張 ──
model Module {
  id          String   @id @default(cuid())
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id])
  slug        String   // 例: "l1-basics", "l2-regulations"
  title       String
  description String?
  order       Int
  isPublished Boolean  @default(false)
  units       Unit[]
  quizzes     Quiz[]
  userProgress UserProgress[]
}

// ── 追加: ユニット（座学セクション or クイズセット） ──
model Unit {
  id       String   @id @default(cuid())
  moduleId String
  module   Module   @relation(fields: [moduleId], references: [id])
  type     UnitType // LECTURE | QUIZ
  order    Int
  title    String
  script   Json?    // LECTURE時のみ使用。会話スクリプト配列を格納
  quizzes  Quiz[]
}

enum UnitType {
  LECTURE
  QUIZ
}

// ── 変更: 既存Quizテーブルに moduleId / unitId / type / explanation を追加 ──
model Quiz {
  id          String       @id @default(cuid())
  moduleId    String
  module      Module       @relation(fields: [moduleId], references: [id])
  unitId      String?
  unit        Unit?        @relation(fields: [unitId], references: [id])
  question    String
  type        QuizType     @default(SINGLE)
  explanation String?      // 解説文（正解後に表示）
  isPublished Boolean      @default(false)
  options     QuizOption[]
  answers     UserAnswer[]
  createdAt   DateTime     @default(now())
}

enum QuizType {
  SINGLE    // 単一選択
  MULTI     // 複数選択
  SCENARIO  // シナリオ型（承認/拒否）
}

// ── 変更: 既存QuizOptionに order フィールドを追加 ──
model QuizOption {
  id        String  @id @default(cuid())
  quizId    String
  quiz      Quiz    @relation(fields: [quizId], references: [id])
  text      String
  isCorrect Boolean @default(false)
  order     Int     // DB保存用の永続順序。出題時はアプリ側でシャッフルする
}
```

### UserProgress の変更

既存の進行度管理テーブルに `courseId` を追加し、Module単位で進行度を管理できるようにする。

```prisma
model UserProgress {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  courseId   String   // 追加
  moduleId   String
  module     Module   @relation(fields: [moduleId], references: [id])
  isComplete Boolean  @default(false)
  score      Int?
  updatedAt  DateTime @updatedAt

  @@unique([userId, moduleId])
}
```

### マイグレーション手順
1. `prisma/schema.prisma` を上記内容で更新
2. `npx prisma migrate dev --name content-structure-refactor` を実行
3. 既存データがある場合は移行スクリプトを `scratchpad/migrate-content.ts` に作成してから実行
4. 型チェック: `npx prisma generate && npx tsc --noEmit`

### 完了条件
- [ ] マイグレーションファイル生成・適用済み
- [ ] `npx prisma generate` エラーなし
- [ ] `npx tsc --noEmit` エラーなし

---

## TASK-B: クイズシードデータ投入

### 担当エージェント
Implementer

### 作業内容
`docs/quiz_seed.json`（または `prisma/seed/` に配置）を読み込んでDBに投入するシードスクリプトを作成・実行する。

### シードデータの場所
プロジェクトオーナーが提供した `quiz_seed.json` を `prisma/seed/bpsp_quiz_seed.json` に配置済みであることを前提とする。配置されていない場合は作業を停止してオーナーに確認すること。

**シードデータ仕様（投入前に確認）:**
- Course: `slug: "bpsp"`, `title: "BPSP（請求書カード払い）BizDev育成コース"`
- Module: L1〜L5の5モジュール（各 `isPublished: true` で投入）
- Quiz: 各Module12問、計60問
- 専門家レビューは不要のため、全問 `isPublished: true` で投入する

### シードスクリプト要件

```typescript
// prisma/seed/seed-bpsp-quiz.ts のイメージ
import { PrismaClient } from '@prisma/client'
import quizData from './bpsp_quiz_seed.json'

const prisma = new PrismaClient()

async function main() {
  // Course の upsert（slug をキーに冪等実行）
  // Module の upsert（slug + courseId をキーに冪等実行）
  // Quiz の upsert（id をキーに冪等実行）
  // QuizOption の upsert（quizId + order をキーに冪等実行）
  // 冪等性を保証し、何度実行しても重複しないこと
}
```

### 完了条件
- [ ] シードスクリプト実行成功（エラーなし）
- [ ] DBにCourse 1件・Module 5件・Quiz 60件・QuizOption 240件が存在することを確認
- [ ] `isPublished = true` が全レコードに設定されていることを確認

---

## TASK-C: 座学UIの会話形式化

### 担当エージェント
Implementer

### 変更対象
`agents/game-level/` の座学ビューアコンポーネント（F003）

### 変更内容

**現状:** テキストと図解のページ送りUI

**変更後:** 先生・生徒の交互発話による会話形式UI

#### スクリプトのデータ構造（Unit.scriptフィールドから取得）

```typescript
type ScriptTurn = {
  turn: number
  speaker: 'teacher' | 'student'
  text: string
}
```

#### UI要件

1. **画面レイアウト**
   - 発話エリアを画面中央に配置
   - `speaker: 'teacher'` → 左側の吹き出し（背景色: プロジェクトのプライマリカラー系）
   - `speaker: 'student'` → 右側の吹き出し（背景色: グレー系）
   - キャラクターのビジュアル（立ち絵）は**このタスクでは実装しない**。アイコンまたはラベル（「先生」「あなた」）で代替する

2. **進行操作**
   - 「次へ」ボタン（またはキーボードの右矢印 / スペースキー）でターンを進める
   - 最終ターンの「次へ」でクイズセクションまたは次のユニットへ遷移する
   - 「前へ」ボタンで前のターンに戻れる

3. **進捗表示**
   - 現在のターン数 / 全ターン数を表示する（例: `12 / 29`）

4. **スクロール**
   - 発話エリアは常に最新ターンが見える位置に自動スクロールする

#### 既存コンポーネントの扱い
- 既存のページ送りビューアは削除せず、`Unit.type === 'LECTURE'` のとき会話形式UIを、それ以外（後方互換用）は既存UIを使う条件分岐で対応すること

### 完了条件
- [ ] L1 Unit 1のスクリプト（29ターン）が画面で正常に表示・進行できる
- [ ] 先生・生徒の吹き出しが左右に正しく表示される
- [ ] 最終ターンから次のユニットへの遷移が動作する
- [ ] モバイル幅（375px）でレイアウト崩れがないこと

---

## TASK-D: クイズエンジンのランダム出題対応

### 担当エージェント
Implementer

### 変更対象
`agents/quiz/` のクイズ取得API・出題ロジック

### 変更内容

#### APIの変更（`agents/quiz/api/`）

クイズ取得エンドポイントに以下のロジックを実装する。

```typescript
// GET /api/quiz/questions?moduleId={moduleId}&count={count}
// レスポンス: ランダムシャッフル済みのクイズ配列

async function getShuffledQuizzes(moduleId: string, count?: number) {
  // 1. moduleId に紐づく isPublished = true のクイズを全件取得
  // 2. Fisher-Yatesシャッフルで順序をランダム化
  // 3. count が指定された場合は先頭 count 件を返す
  // 4. 各クイズの options もシャッフルして返す（isCorrect は保持）
  // 5. isCorrect はサーバーサイドのみで保持し、クライアントには返さない
}
```

#### シャッフル実装の要件

```typescript
// Fisher-Yatesシャッフル（crypto.getRandomValues使用でより安全に）
function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
```

#### セキュリティ要件（既存設計の維持）
- `isCorrect` フィールドはクライアントに返さない（既存設計: `agents/quiz/api/` の POST `/api/quiz/answer` でサーバーサイドのみ判定）
- シャッフル済みoptionsの並び順はセッション開始時に1回決定し、回答送信まで変わらないこと

#### クライアント側の変更（`agents/quiz/ui/`）
- セッション開始時（レベル入室時）にシャッフル済み問題リストをAPIから取得してstateに保持する
- 同一セッション内で問題の順序が変わらないこと（再レンダリングでシャッフルしない）

### 完了条件
- [ ] 同じModuleを2回プレイすると問題の出題順が変わることを手動確認
- [ ] 選択肢の並び順も毎回変わることを確認
- [ ] 正誤判定がサーバーサイドで正しく動作していることを確認
- [ ] 既存のパラメータ更新ロジック（コンプライアンス/GMV/UX）が引き続き動作すること

---

## TASK-E: feature_list.json の更新

### 担当エージェント
Orchestrator

### 変更内容

以下のフィールドを更新する。

**F009〜F013（L1〜L5コンテンツ）のステータス変更:**
```json
{
  "status": "COMPLETE",
  "blocked_reason": null,
  "note": "専門家レビュー不要の方針変更によりBLOCKED解除。quiz_seed.jsonのシード投入をもってCOMPLETE。"
}
```

**新規タスクの追加（以下をtasksに追記）:**

```json
{
  "id": "F017",
  "title": "コンテンツ構造拡張（Course/Module/Unit 3層モデル）",
  "description": "Prismaスキーマ変更・クイズシード投入・座学会話形式化・ランダム出題対応の一連の変更",
  "priority": "Must",
  "status": "COMPLETE",
  "phase": "1.1",
  "agent": "game-level",
  "feature_requirement_ids": []
},
{
  "id": "F018",
  "title": "ナビゲーション改善（戻るボタン・パンくず・グローバルメニュー）",
  "description": "全画面に戻るボタン・パンくず・グローバルナビを追加。agents/_shell/のレイアウト変更。",
  "priority": "Must",
  "status": "READY",
  "phase": "1.1",
  "agent": "_shell",
  "feature_requirement_ids": []
}
```

---

## 共通の注意事項

- **`core/` への変更**: TASK-AのPrismaスキーマ変更は `core/db/` に影響する。`core/.clauderules` を確認のうえ、変更前に依存関係を全列挙すること
- **冪等性**: シードスクリプトは何度実行しても重複データが生じない実装にすること
- **ブランチ**: `feature/content-structure-refactor` ブランチを作成してから作業を開始すること
- **コミット粒度**: TASK単位でコミットすること（TASK-A完了→コミット、TASK-B完了→コミット）
- **plans保存**: 本ファイルを `plans/2026-05-28-content-structure-refactor.md` として保存した上で作業を開始すること

---

## 完了定義（全TASK）

| Task | 完了条件 |
|------|---------|
| TASK-A | マイグレーション適用・型チェックエラーなし |
| TASK-B | DB上に正しい件数のデータが存在し isPublished=true |
| TASK-C | 会話形式UIが動作・モバイル対応済み |
| TASK-D | ランダム出題が機能・セキュリティ設計の維持を確認 |
| TASK-E | feature_list.json 更新・コミット済み |
| **全体** | CI green・lint/type-check エラーなし・手動動作確認済み |
