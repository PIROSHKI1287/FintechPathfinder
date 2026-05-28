---
date: 2026-05-28
task_id: TASK-C
title: 会話形式スクリプト Unit シード投入
status: undistilled
---

## 実施内容

`prisma/seed/script_seed.json` に全5レベルの会話スクリプト（計121ターン）を定義し、
`prisma/seed/seed-bpsp-script.ts` で Unit テーブルに冪等投入した。

## 主な学び

### Unit の upsert は id で冪等化できる
- `prisma.unit.upsert({ where: { id: 'bpsp-l1-unit-lecture' }, ... })` で安全に再実行可能
- Unit モデルに `@unique` が `id` しかないため id 指定が最も確実

### ConversationViewer が表示される条件
- `Unit.type = 'LECTURE'` かつ `Unit.script` が非 null の JSON 配列であること
- `getLevelScript()` が Array.isArray チェックを行うため、JSON が配列でない場合は null 返却
- スクリプト投入前は `learn/page.tsx` が常に StoryViewer にフォールバックしていた

### Json 型の cast は `unknown` 経由が必須
- `unit.script as ScriptTurn[]` は Prisma の JsonValue 型と重複しないためエラー
- `raw as unknown as ScriptTurn[]` の 2段キャストで解決
