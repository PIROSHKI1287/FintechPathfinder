#!/usr/bin/env bash
# Usage: bash hooks/on-error.sh "エラー内容" "タスクID"
# CLAUDE.md 絶対制約#3: 予想外の動作・エラーは即座にここに記録する

set -euo pipefail

MESSAGE="${1:-}"
TASK_ID="${2:-unknown}"

if [ -z "$MESSAGE" ]; then
  echo "Usage: bash hooks/on-error.sh \"エラー内容\" \"タスクID\""
  exit 1
fi

DATE=$(date -u +"%Y-%m-%d")
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
OUTDIR="memories/lessons_learned"
OUTFILE="${OUTDIR}/${DATE}-${TASK_ID}-error.md"

mkdir -p "$OUTDIR"

# Git Bash では format string が '-' で始まると option と誤解釈されるため
# 全て '%s\n' 形式で出力する
{
  printf '%s\n' "---"
  printf '%s\n' "date: ${TIMESTAMP}"
  printf '%s\n' "task_id: ${TASK_ID}"
  printf '%s\n' "type: error"
  printf '%s\n' "distilled: false"
  printf '%s\n' "---"
  printf '%s\n' ""
  printf '%s\n' "## エラー内容"
  printf '%s\n' ""
  printf '%s\n' "${MESSAGE}"
  printf '%s\n' ""
  printf '%s\n' "## 発生状況"
  printf '%s\n' ""
  printf '%s\n' "- タスク: ${TASK_ID}"
  printf '%s\n' "- 記録日時: ${TIMESTAMP}"
  printf '%s\n' ""
  printf '%s\n' "## 対処・再発防止"
  printf '%s\n' ""
  printf '%s\n' "（実装者が記入）"
} > "$OUTFILE"

echo "✓ エラー記録: ${OUTFILE}"
