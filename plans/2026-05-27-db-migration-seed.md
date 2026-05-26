# Plan: DB マイグレーション + シードデータ作成
# Task ID: db-migration-seed

## 環境
- Docker Desktop: winget でインストール済み・起動待ち
- ローカル DB: docker-compose.yml の PostgreSQL 16 (bpsp_db_local)
- .env: DATABASE_URL = docker-compose の接続文字列

## 実行順序
1. Docker Desktop 起動確認
2. .env 作成（docker-compose の接続文字列）
3. `docker compose up -d` で PostgreSQL コンテナ起動
4. `prisma migrate dev --name init` でマイグレーション適用
5. `prisma db seed` でベースシード実行
6. `npm run db:seed:dev` で開発テストデータ投入

## シードデータ設計

### prisma/seed.ts（本番向けベースデータ）
- Level 1〜5（isPublished=false）
- 基本辞書用語 10件（よく使う BPSP 用語）

### prisma/seed-dev.ts（開発テスト用）
- Level 1 を isPublished=true に更新
- Level 1 のストーリーページ 3ページ（プレースホルダーテキスト）
- Level 1 のクイズ問題 3問（ゲームメカニクス確認用）
  - compliance がゼロになるルートもテスト可能にする
- 辞書用語を追加で 5件

## package.json スクリプト追加
```json
"db:up":       "docker compose -f infra/docker/docker-compose.yml up -d",
"db:down":     "docker compose -f infra/docker/docker-compose.yml down",
"db:migrate":  "prisma migrate dev",
"db:seed":     "prisma db seed",
"db:seed:dev": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed-dev.ts",
"db:reset":    "prisma migrate reset --force"
```

## セキュリティ
- .env は .gitignore 対象（gitignore 確認・追加）
- seed-dev.ts は開発専用ガード付き
- シードデータのパスワードや機密情報なし
