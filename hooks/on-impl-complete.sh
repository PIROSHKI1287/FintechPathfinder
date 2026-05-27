#!/usr/bin/env bash
# Usage: bash hooks/on-impl-complete.sh <taskId>
# 実装完了後に呼ぶ。型チェック・lint を実行し results/{taskId}-impl.json を生成する。
# Reviewer はこのファイルを起点にレビューを行う。

set -euo pipefail

TASK_ID="${1:-}"
if [ -z "$TASK_ID" ]; then
  echo "Usage: bash hooks/on-impl-complete.sh <taskId>"
  exit 1
fi

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
RESULTS_FILE="results/${TASK_ID}-impl.json"
mkdir -p results

echo "========================================"
echo " 実装チェック: ${TASK_ID}"
echo "========================================"

# ── 型チェック（失敗しても続行して結果を記録） ────
echo ""
echo "▶ npm run type-check"
set +e
TYPE_OUT=$(npm run type-check 2>&1)
TYPE_EXIT=$?
set -e
echo "$TYPE_OUT"
TYPE_STATUS=$([ $TYPE_EXIT -eq 0 ] && echo "PASS" || echo "FAIL")

# ── Lint（失敗しても続行して結果を記録） ──────────
echo ""
echo "▶ npm run lint"
set +e
LINT_OUT=$(npm run lint 2>&1)
LINT_EXIT=$?
set -e
echo "$LINT_OUT"
LINT_STATUS=$([ $LINT_EXIT -eq 0 ] && echo "PASS" || echo "FAIL")

# ── 変更ファイル取得 ─────────────────────────────
RAW_CHANGED=$(git diff --name-only HEAD 2>/dev/null | tr '\n' '|')
RAW_STAGED=$(git diff --name-only --cached 2>/dev/null | tr '\n' '|')
ALL_CHANGED=$(printf '%s%s' "$RAW_CHANGED" "$RAW_STAGED" | sed 's/|$//' | sed 's/^|//')

# ── 総合判定 ────────────────────────────────────
OVERALL=$([ "$TYPE_STATUS" = "PASS" ] && [ "$LINT_STATUS" = "PASS" ] && echo "PASS" || echo "FAIL")

# ── results/{taskId}-impl.json 生成 ─────────────
# jq がなくても動くよう、変更ファイルはシングルクォートで囲まずそのまま文字列に格納
cat > "$RESULTS_FILE" <<JSONEOF
{
  "task_id": "${TASK_ID}",
  "timestamp": "${TIMESTAMP}",
  "type_check": "${TYPE_STATUS}",
  "lint": "${LINT_STATUS}",
  "status": "${OVERALL}",
  "changed_files": "${ALL_CHANGED}",
  "next_step": "Reviewer"
}
JSONEOF

echo ""
echo "========================================"
echo " 結果: ${OVERALL}"
echo " 出力: ${RESULTS_FILE}"
echo "========================================"

if [ "$OVERALL" = "FAIL" ]; then
  echo ""
  echo "❌ 型エラーまたは lint エラーがあります。修正後に再実行してください。"
  exit 1
fi

echo ""
echo "✓ 自動チェック PASS。次: Reviewer がコードレビューを実施してください。"
