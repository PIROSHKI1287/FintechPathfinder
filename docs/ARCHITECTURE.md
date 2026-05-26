# Architecture Document
# 設計思想: 生物学的AI管理OS

## なぜこの構造か

このプロジェクトは、AIエージェント（Claude Code）との協働効率を最大化するため、
生物神経系にインスパイアされたディレクトリ構造を採用する。

**核心原理**: AIの知性の高さは「常にリソースを使い続けること」ではなく、
「いつ休み、いつ思考を集中させるか」の制御に依存する。

---

## 生物学的アナロジー対応表

| ディレクトリ | 生物学的対応 | 役割 |
|-------------|------------|------|
| `CLAUDE.md` | 大脳皮質 | 過去の失敗から蒸留されたルール・制約・人格 |
| `.clauderules` | 本能・反射 | 意識的判断より前に発動する自動行動規則 |
| `docs/` | 長期記憶（静的） | 安定した参照知識。頻繁には変わらない |
| `core/` | 脳幹 | 生命維持に必要な基盤コード。滅多に変えない |
| `memories/` | 海馬 | 経験の蓄積・パターン抽出・CLAUDE.mdへの蒸留元 |
| `plans/` | 前頭前皮質 | 実行前シミュレーション。考えてから動く |
| `scratchpad/` | 作業記憶 | 一時的な計算空間。最終成果物に含めない |
| `agents/[feature]/` | 大脳新皮質の機能カラム | UI・API・ロジックを同居させた自己完結型専門家 |
| `agents/_shell/` | 運動野（出力系） | グローバルルーティング・レイアウト |
| `agents/_shared/` | 連合野 | 複数専門家が共有するUI・ロジック |

---

## MoE（混合専門家）構造

各 `agents/[feature]/` サブディレクトリは**自己完結型の専門家回路**を表す。

### レイヤーベース（旧・非推奨）vs フィーチャーベース（MoE原則）

```
❌ レイヤーベース（アテンション分散）      ✅ フィーチャーベース（アテンション局所化）
src/components/analyzer-ui/           agents/analyzer/
src/hooks/useAnalyzer.ts          →     ├── ui/        ← UIここだけ
api/services/analyzer.service.ts       ├── api/       ← APIここだけ
api/controllers/analyzer.ctrl.ts       ├── logic/     ← ロジックここだけ
                                        └── .clauderules ← 本能ここだけ
```

**効果**: Claudeが「analyzer を修正して」と言われたとき、
`agents/analyzer/` 一箇所だけ読めばよい。トークン消費が最小化される。

### 新規エージェントの追加手順
1. `agents/_template/` をコピーして `agents/[feature-name]/` を作成
2. `.clauderules` の「責任範囲」を記入する
3. `docs/ARCHITECTURE.md` の「重要な設計判断の記録」に追記する

---

## アテンション局所化（ノイズ抑制）

ディレクトリレベルの `.clauderules` はアテンション境界を強制する:
- Claudeは現在のタスクに関連するディレクトリの `.clauderules` のみを読む
- これはトランスフォーマーにおける「Localized Attention」を外部から強制することに等しい
- 効果: 幻覚リスクの低減、一貫性の向上

---

## 自己進化プロトコル

```
[生成フェーズ]   → /agents/[feature]/ へのコード出力（ui/・api/・logic/ に分離）
      ↓
[自己監査フェーズ] → /plans/validation_report.md への自己チェック記録
      ↓
[修正フェーズ]   → 監査結果に基づく CLAUDE.md の一時的なルール更新
      ↓
[反省フェーズ]   → /memories/lessons_learned/ の蒸留 → CLAUDE.md に統合
```

---

## [プロジェクト固有] 技術スタック決定

```
決定内容: Next.js 14.2+ (App Router) + Prisma + PostgreSQL (Railway) + NextAuth.js v5
理由: Next.js はフロント・バックを一体管理できSEO対応も容易。PrismaはPostgreSQLとの
      型安全な連携とマイグレーション管理が容易。NextAuth.js v5はNext.js App Routerと
      の相性が最も高くGoogle OAuth追加も容易。
受け入れたトレードオフ:
  - Railway の無料プランはコールドスタートがある（社内利用のため許容）
  - NextAuth.js v5 は beta 段階だが App Router との互換性を優先
  - Jotai はパラメータ管理のみに限定（複雑な状態管理は将来課題）
却下した選択肢:
  - Supabase: コンテンツを柔軟にDB管理したいため Prisma+Railway を選択
  - Clerk: OSS 優先・カスタマイズ性を重視して NextAuth.js を選択
  - tRPC: Phase 1 では REST で十分、複雑性を避ける
```

---

## [プロジェクト固有] データフロー図

```
[ユーザー(ブラウザ)]
    ↓ HTTP
[app/ — Next.js App Router（薄いアダプタ）]
    ↓ import
[agents/[feature]/ui/ — React コンポーネント]
    ↓ fetch / Server Action
[app/api/[route]/ — Route Handler（薄いアダプタ）]
    ↓ import
[agents/[feature]/api/ + logic/ — ビジネスロジック]
    ↓ import
[core/db/prisma.ts — Prisma Client]
    ↓ SQL
[PostgreSQL (Railway)]

認証フロー:
[middleware.ts] → [core/auth/auth.ts (NextAuth.js)] → [DB sessions / JWT]
```

---

## [プロジェクト固有] 重要な設計判断の記録

| 日付 | 判断内容 | 理由 | 代替案 |
|------|---------|------|--------|
| 2026-05-26 | app/ をプロジェクトルートに配置（標準 Next.js） | Next.js は app/ の配置場所をルートまたは src/ のみサポート。要件定義書 §8.3 の agents/_shell/app/ は概念モデルであり、実装では標準構造を採用 | agents/_shell/app/ へのシンボリックリンク（Windows での信頼性に懸念） |
| 2026-05-26 | NextAuth.js v5 (Auth.js beta) 採用 | Next.js App Router との最高互換性。stable v4 は App Router のサポートが不完全 | NextAuth.js v4（stable だが App Router 対応不完全） |
| 2026-05-26 | ゲームパラメータ計算をサーバーサイドに限定 | クライアント改ざん防止。quiz agents/quiz/api/ の POST /api/quiz/answer でのみ計算・保存 | クライアントサイド計算（改ざんリスクあり） |
| 2026-05-26 | コンテンツを isPublished フラグで管理 | 社内識者レビュー前のコンテンツを誤公開しない。BLOCKED ステータスのタスクはレビュー待ち | 別テーブルでドラフト管理 |
