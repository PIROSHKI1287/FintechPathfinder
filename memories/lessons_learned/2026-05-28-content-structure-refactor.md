---
date: 2026-05-28
task_id: F017
title: Course/Module/Unit 3層スキーマ拡張
status: undistilled
---

## 実施内容

Prismaスキーマをゼロデータロスで大規模リネームした（Level→Module, QuizQuestion→Quiz, QuizChoice→QuizOption）。

## 主な学び

### @@map/@map によるゼロデータロスリネーム
- モデル名をリネームしながら既存テーブル名を保持するには `@@map("old_table")` を使う
- フィールド名をリネームしながら既存カラム名を保持するには `@map("old_column")` を使う
- この戦略により、マイグレーションでは新テーブル・新カラムの追加のみが発生し、既存データは無傷
- **@@unique の accessor 名**もリネームに追随する（DB制約名は変わらないが、Prisma client での参照名が変わる）

### JSON型フィールドの型アサーション
- Prisma の `Json` 型フィールドを TypeScript の具体型にキャストするには `as unknown as T` が必要
- `as T` 直接は「型が十分に重複していない」エラーになる

### UIコンポーネント型との整合
- バックエンドのPrisma型を変更したとき、フロントエンドのインターフェース定義（QuizScreen.tsxのChoiceなど）も同時に更新が必要
- tsc --noEmitを全ファイルに対して実行して漏れを発見すること

### 会話形式UIのuseEffect自動スクロール
- `ref.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })` を `current` stateの変化に依存させることで、新しいターンが追加されるたびに最下部にスクロールできる

### シードスクリプトの冪等設計
- QuizOptionには `@@unique([quizId, order])` がないため、upsertではなく `deleteMany + createMany` で冪等性を確保

## 予想外の動作

- `npx tsx -e` でheredoc（PowerShellの `@'...'@`）を使うと、esbuildがシングルクォートを文字列区切り文字として誤解析してエラーになる。インラインコードはファイルに書いて実行する方が安全。
