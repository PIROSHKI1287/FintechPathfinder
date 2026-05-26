# PROJECT_SETUP_GUIDE.md
# WEBサービス別セットアップガイド — 変更が必要なファイルと内容

このガイドは新しいWEBサービスを開始するとき、何をどこに書けばよいかを明確にする。

---

## ステップ1: 全プロジェクト共通（必ず実施）

以下のファイルはどんなWEBサービスでも必ず記入が必要。

### `CLAUDE.md` — 変更箇所

| 箇所 | 記入内容 | 例 |
|------|---------|-----|
| `Mission` | このサービスが何をするか1文で | 「個人のタスクをAIが優先順位付けするTodoアプリ」 |
| `アーキテクチャ設定` の各フィールド | 使用技術スタック | 下記「技術スタック別」参照 |
| `最終更新` | 今日の日付 | 2026-05-03 |

### `docs/ARCHITECTURE.md` — 変更箇所

| 箇所 | 記入内容 |
|------|---------|
| `[プロジェクト固有] 技術スタック決定` | 選定技術と理由・トレードオフ |
| `[プロジェクト固有] データフロー図` | ユーザー→フロント→API→DB の流れ |
| `[プロジェクト固有] 重要な設計判断の記録` | 最初の技術選定を記録 |

### `README.md` — 変更箇所

テンプレートのREADMEはテンプレート自体の説明になっているため、プロジェクト固有の情報に書き換える。

| 箇所 | 変更内容 |
|------|---------|
| タイトル行 | `Self-Evolving AI Management OS — Web開発テンプレート` → `[プロジェクト名] — [一言説明]` |
| 「このリポジトリの目的」 | テンプレート説明 → プロジェクトの概要・対象ユーザー・解決する課題 |
| 「新しいプロジェクトを始めるとき」 | このセクションを「セットアップ手順」（install / env / 起動コマンド）に置き換える |
| 「技術スタック」セクションを追加 | 採用技術の一覧（フレームワーク・DB・インフラ） |
| ドキュメント一覧テーブル | テンプレート固有のリンクを削除し、プロジェクト固有のリンクに更新 |

---

## ステップ2: 技術スタック別 ディレクトリ変更

> **共通原則（MoE）**: どのスタックでも `agents/[feature]/` に UI・API・ロジックを同居させる。
> フレームワーク固有のエントリポイントは「薄いアダプタ」として最小限に作成する。

### パターンA: Next.js（フルスタック）

**使用ケース**: SEO重視・フロントとAPIを一体管理したい場合

**ディレクトリ構造（agents/ 中心）**
```
agents/
├── _shell/
│   └── ui/
│       ├── layout.tsx          # グローバルレイアウト（agents/_shell/ の責任）
│       └── globals.css
├── _shared/
│   └── ui/                     # shadcn/ui等の汎用コンポーネント
└── [feature]/                  # 機能ごとに追加（_template/ をコピー）
    ├── .clauderules
    ├── ui/                     # 機能固有コンポーネント・フック
    ├── api/                    # Next.js API Routes または Server Actions
    └── logic/                  # バリデーション・ビジネスロジック

# フレームワークアダプタ（薄く保つ）
app/                            # Next.js App Router（agents/ を import するだけ）
├── layout.tsx                  → import from 'agents/_shell/ui/layout'
├── page.tsx                    → import from 'agents/[top-feature]/ui/'
└── [feature]/
    └── page.tsx                → import from 'agents/[feature]/ui/'
```

**追加が必要なファイル**
- `package.json` — Next.js依存関係
- `next.config.ts` — Next.js設定
- `tailwind.config.ts` — Tailwind CSS設定（使用する場合）
- `tsconfig.json` — TypeScript設定（`@/agents/*` パスエイリアス設定を含む）
- `.env.local` — 環境変数（gitignore済み）

**`CLAUDE.md` のアーキテクチャ設定記入例**
```
フレームワーク (Frontend) : Next.js 15 (App Router) ← agents/ へのアダプタ
フレームワーク (Backend)  : Next.js Server Actions / Route Handlers（agents/[f]/api/）
データベース              : [選択したDB]
認証                      : NextAuth v5 / Clerk（core/auth/ に配置）
インフラ                  : Vercel
主要パターン              : MoE（agents/ 中心）+ Server Components
```

---

### パターンB: React + 独立バックエンド（FastAPI / Express / Hono）

**使用ケース**: フロントとバックを分離・マイクロサービス志向の場合

**ディレクトリ構造（agents/ 中心）**
```
agents/
├── _shell/
│   └── ui/                     # ルーティング設定・グローバルレイアウト
├── _shared/
│   ├── ui/                     # 汎用UIコンポーネント
│   └── logic/
│       └── api-client.ts       # バックエンドAPIクライアント（共通）
└── [feature]/
    ├── .clauderules
    ├── ui/                     # Reactコンポーネント・カスタムフック
    ├── api/                    # FastAPI / Express のルートハンドラ
    └── logic/                  # ビジネスロジック（言語問わず）

core/
├── db/                         # DB接続・ORM初期化（SQLAlchemy / Prisma）
├── auth/                       # JWT検証・セッション管理
└── middleware/                 # CORS・レート制限・ロギング
```

**追加が必要なファイル（フロントエンド）**
- `package.json` — React / Vite依存関係
- `vite.config.ts` — Vite設定（`@/agents/*` パスエイリアス含む）

**追加が必要なファイル（バックエンド: FastAPI）**
- `requirements.txt` / `pyproject.toml`
- `main.py` — FastAPIアプリ（agents/ の api/ を include するだけ）

**`CLAUDE.md` のアーキテクチャ設定記入例**
```
フレームワーク (Frontend) : React 19 + Vite ← agents/[f]/ui/ へのアダプタ
フレームワーク (Backend)  : FastAPI ← agents/[f]/api/ を include するだけ
データベース              : [選択したDB]（core/db/ に接続設定）
認証                      : JWT（core/auth/ に配置）
インフラ                  : Vercel (Front) + Railway (API)
主要パターン              : MoE（agents/ 中心）+ Repository Pattern
```

---

### パターンC: SaaS（Supabase / Firebase BaaS）

**使用ケース**: 個人開発・MVP・認証とDBをマネージドにしたい場合

**ディレクトリ構造の特徴**
```
core/
└── db/
    ├── supabase-client.ts      # Supabaseクライアント（ブラウザ用）
    └── supabase-server.ts      # Supabaseクライアント（サーバー用）
    # → agents/ 全体からここだけをインポートして使う

agents/
└── [feature]/
    ├── api/                    # Supabase Edge Functions または Next.js Route Handlers
    └── logic/                  # Supabaseのクエリを呼ぶビジネスロジック
```

**追加が必要なファイル**
- `supabase/` — Supabase CLIが生成（`supabase init`）
  - `supabase/migrations/` — DBマイグレーション
  - `supabase/seed.sql` — 初期データ

**`agents/[feature]/api/` について**
Supabase/Firebaseを使う場合、バックエンドAPIは `agents/[feature]/api/` に最小限のみ作成。
大部分はクライアントから直接Supabaseを呼ぶ（→ `CLAUDE.md` に明記する）

---

## ステップ3: データベース別 追加設定

### PostgreSQL（直接接続）
追加ファイル:
- `core/db/` — DB接続設定・プール管理・ORMモデル（Prisma / Drizzle / SQLAlchemy）
- `infra/docker/docker-compose.yml` — ローカルDB

### Supabase
追加ファイル:
- `supabase/` ディレクトリ（supabase CLIで自動生成）
- `core/` に Supabaseクライアントラッパーを配置

---

## ステップ4: インフラ別 設定

### Vercel（推奨: フロントエンド）
追加ファイル:
- `vercel.json` — デプロイ設定（必要な場合）

### Docker（バックエンド・自己ホスト）
変更ファイル:
- `infra/docker/Dockerfile` — 作成必要
- `infra/docker/docker-compose.yml` — 作成必要

### GitHub Actions（CI/CD）
追加ファイル:
- `.github/workflows/ci.yml` — テスト自動化
- `.github/workflows/deploy.yml` — 自動デプロイ

---

## ステップ5: 新規エージェントの追加手順

新しい機能（エージェント）を追加するたびに実施:

1. `agents/_template/` を `agents/[feature-name]/` にコピー
2. `agents/[feature-name]/.clauderules` の「責任範囲」セクションを記入
3. `docs/ARCHITECTURE.md` の「重要な設計判断の記録」に追記

**新エージェントの `.clauderules` 記入例**
```
# agents/user-auth/ .clauderules
## この専門家の責任範囲
ユーザーの登録・ログイン・プロフィール管理を担当する。

## この専門家が core/ に依存できるもの
- core/auth/ : JWTの生成・検証
- core/db/   : usersテーブルへのクエリ

## 禁止事項
- 他のエージェントのDBテーブルに直接アクセスしない
- パスワードをハッシュ化せずにDBに保存しない
```

---

## 変更不要なファイル（どのプロジェクトでも同じ）

| ファイル | 理由 |
|---------|------|
| `.clauderules`（Root） | AI行動原則は普遍的 |
| `core/.clauderules` | 保護ルールは普遍的 |
| `docs/OPERATING_GUIDE.md` | 操作手順は普遍的 |
| `docs/ARCHITECTURE.md` の生物学アナロジー表 | 設計思想は不変 |
| `memories/` の構造 | 経験蓄積の仕組みは普遍的 |
| `plans/` の構造 | 計画先行原則は普遍的 |

---

## 最小起動チェックリスト

新プロジェクト開始時にこの順序で実施:

- [ ] `CLAUDE.md` の Mission と アーキテクチャ設定を記入
- [ ] `docs/ARCHITECTURE.md` の技術スタック決定セクションを記入
- [ ] `README.md` をプロジェクト固有に書き換える（タイトル・概要・セットアップ・技術スタック）
- [ ] 技術スタックに対応したパッケージファイル（package.json等）を作成
- [ ] `.env` ファイルを作成（`.gitignore` 対象であることを確認）
- [ ] `infra/docker/docker-compose.yml` を作成（DBをDockerで管理する場合）
- [ ] 最初の計画を `plans/` に作成して開発開始
