# 計画: BPSP BizDev育成ゲーム — ディレクトリ構造セットアップ
**タスクID**: setup-bpsp01  
**作成日**: 2026-05-26  
**担当モデル**: claude-sonnet-4-6  
**スキル**: system-design（error_cost: high）  

---

## 目的
要件定義書（BPSP_requirements.md v1.1.0）に基づき、Next.js 14+ベースの  
BPSPゲームプロジェクト専用のディレクトリ構造を構築する。  
実装前の骨格（skeleton）として、設定ファイル・スキーマ・エージェント.clauderules・  
ルーティングスケルトンを整備し、Implementer が即座に実装を開始できる状態にする。

---

## スコープ確認

### 対象（今回作成・更新するもの）
| カテゴリ | ファイル群 | 備考 |
|---|---|---|
| 設定ファイル | package.json / tsconfig.json / next.config.ts / tailwind.config.ts / postcss.config.js / eslint.config.mjs / .prettierrc / components.json | Next.js 14+ 全依存関係 |
| 環境変数 | .env.example | 実値なし。テンプレートのみ |
| DB スキーマ | prisma/schema.prisma | 要件定義書 §6 全エンティティ |
| Prisma seed | prisma/seed.ts | 初期コンテンツの骨格のみ |
| タスク管理 | feature_list.json | 全要件を READY で登録 |
| エージェント | agents/auth / game-level / quiz / dictionary / admin の .clauderules と サブディレクトリ | 各特化家の本能ルール |
| ルーティング | app/ 下の全 page.tsx / layout.tsx / globals.css | skeleton のみ（TODO コメント） |
| API routes | app/api/ 下の全 route.ts | skeleton のみ |
| Core 基盤 | core/db/prisma.ts / core/auth/auth.ts / core/middleware/auth.ts / core/utils/cn.ts / core/utils/schemas.ts | |
| インフラ | .github/workflows/ci.yml / infra/docker/docker-compose.yml | |
| ドキュメント更新 | CLAUDE.md（アーキテクチャ設定）/ docs/ARCHITECTURE.md | |
| プロジェクト記録 | memories/confirmation_history.md | |

### core/ 変更の確認
- `core/db/prisma.ts`: Prisma Client シングルトン（新規作成 = OK）
- `core/auth/auth.ts`: NextAuth.js 設定（新規作成 = OK）
- `core/middleware/auth.ts`: 認証ミドルウェア（新規作成 = OK）
- `core/utils/cn.ts` / `core/utils/schemas.ts`: ユーティリティ（新規作成 = OK）

---

## 技術決定

### フレームワーク構成
```
フレームワーク (Frontend) : Next.js 14.2+ (App Router) + React 18
フレームワーク (Backend)  : Next.js Route Handlers (agents/[f]/api/ から import)
データベース              : PostgreSQL (Railway)
認証                      : NextAuth.js v5 (Auth.js) + Credentials Provider
ORM                       : Prisma 5.x
インフラ                  : Vercel (App) + Railway (DB)
状態管理                  : Jotai（ゲームパラメータ管理）
バリデーション            : Zod（フロント・サーバー両面）
スタイリング              : Tailwind CSS + shadcn/ui
主要パターン              : MoE（agents/ 中心）+ Server Components + REST
```

### ディレクトリ方針（Next.js 互換性）
要件定義書 §8.3 は `agents/_shell/app/` を Next.js App Router として指定しているが、  
Next.js 14 は標準で `app/` をプロジェクトルートに要求するため、以下の方針を採用する：

- `app/` をプロジェクトルートに配置（標準 Next.js、PROJECT_SETUP_GUIDE.md Pattern A）
- `app/` の各 page.tsx は薄いアダプタとして機能し、`agents/[feature]/ui/` から import
- `app/api/` の各 route.ts は `agents/[feature]/api/` のロジックを呼び出す
- `agents/_shell/ui/` にグローバルレイアウトコンポーネントと globals.css を配置
- この方針は `agents/_shell/app/` の CONCEPTUAL な位置付けと同一

### 未決定事項（詳細設計フェーズで確定）
- ゲームパラメータ初期値・最大値・変化幅（要件定義書 §10 #4）
- 合格ライン（何問正解でレベルクリアか）および「致命的」テストの定義（§10 #5）
- Vercel vs Railway App デプロイ先（§10 #1）
- NextAuth.js Google OAuth 追加可否（§10 #2）
- 座学コンテンツのデータ構造（MDX vs カスタムJSON vs DB管理）（§10 #3）

---

## 実行手順

1. [x] SECURITY_HALT チェック → NO HALT 確認済み
2. [ ] plans/ に本ファイルを保存（今ここ）
3. [ ] 設定ファイル群を作成
4. [ ] prisma/schema.prisma を作成
5. [ ] feature_list.json を作成
6. [ ] agents/[feature]/ の .clauderules とサブディレクトリを作成
7. [ ] app/ ルーティング skeleton を作成
8. [ ] core/ 基盤ファイルを作成
9. [ ] infra/ CI/CD・Docker ファイルを作成
10. [ ] CLAUDE.md アーキテクチャ設定を更新
11. [ ] docs/ARCHITECTURE.md を更新
12. [ ] memories/confirmation_history.md に記録
13. [ ] results/setup-bpsp01-complete.json を作成
14. [ ] feature_list.json の SETUP-001 を COMPLETE に更新
15. [ ] git commit && git push

---

## 完了条件
- `npm install` が実行できる状態（package.json と全依存関係が正しい）
- `npm run type-check` がゼロエラーで通る skeleton が揃っている
- `prisma generate` が実行できる状態（schema.prisma が正しい）
- 全 feature エージェントの .clauderules が存在する
- feature_list.json に全タスクが登録されている
