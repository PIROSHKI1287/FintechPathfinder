# hooks パイプライン構築計画

## 目的
Implementer → Reviewer → QA → 人間 E2E のループをフック駆動で自動化し、
エラーを人間の手動確認前に検知できる体制を作る。

## 作成ファイル

| ファイル | 種別 | トリガー |
|---|---|---|
| `hooks/on-error.sh` | プロジェクトフック | AI が明示的に呼ぶ（CLAUDE.md 絶対制約#3） |
| `hooks/on-impl-complete.sh` | プロジェクトフック | 実装完了後に AI が呼ぶ（完了プロトコル #1 相当） |
| `hooks/on-review-pass.sh` | プロジェクトフック | Reviewer PASS 後に AI が呼ぶ |
| `hooks/pre-commit.sh` | git pre-commit hook | git commit 時に自動発火 |
| `hooks/install.sh` | インストーラ | 初回セットアップ時に手動実行 |
| `.claude/settings.json` | Claude Code フック | Write/Edit ツール使用後に自動発火 |

## 各フックの役割

### on-error.sh
- 引数: "エラー内容" "タスクID"
- `memories/lessons_learned/YYYY-MM-DD-{taskId}-error.md` に自動記録

### on-impl-complete.sh
- 引数: taskId
- npm run type-check → 失敗なら exit 1
- npm run lint → 失敗なら exit 1
- git diff --name-only で変更ファイル一覧取得
- `results/{taskId}-impl.json` を生成（Reviewer の入力）

### on-review-pass.sh
- 引数: taskId verdict(PASS|FAIL) [comment]
- FAIL なら Implementer 差し戻しメッセージを出力して exit 1
- PASS なら変更ファイルから E2E チェックリストを生成
- `results/{taskId}-qa-checklist.json` を生成（人間の E2E 確認用）

### pre-commit.sh（git hook として .git/hooks/pre-commit に配置）
- npm run type-check → 失敗なら commit ブロック

### install.sh
- hooks/pre-commit.sh → .git/hooks/pre-commit にコピー

### .claude/settings.json
- PostToolUse(Write|Edit): 実装ファイル変更後に型チェックを自動実行

## パイプライン全体フロー

```
[実装]
  ↓ bash hooks/on-impl-complete.sh {taskId}
  ↓ type-check + lint PASS
  ↓ results/{taskId}-impl.json 生成
[Reviewer ロールで impl.json を読んでコードレビュー]
  ↓ bash hooks/on-review-pass.sh {taskId} PASS
  ↓ results/{taskId}-qa-checklist.json 生成（E2E 手順）
[人間が E2E 確認]
  ↓ git commit（pre-commit hook が type-check 再実行）
  ↓ git push
```
