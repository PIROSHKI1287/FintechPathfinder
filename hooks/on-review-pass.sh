#!/usr/bin/env bash
# Usage: bash hooks/on-review-pass.sh <taskId> <PASS|FAIL> [comment]
# Reviewer がレビュー結果を記録する。
# PASS: QA チェックリストを生成して人間の E2E 確認に渡す。
# FAIL: 差し戻しメッセージを出力して exit 1。

set -euo pipefail

TASK_ID="${1:-}"
VERDICT="${2:-}"
COMMENT="${3:-}"

if [ -z "$TASK_ID" ] || [ -z "$VERDICT" ]; then
  echo "Usage: bash hooks/on-review-pass.sh <taskId> <PASS|FAIL> [comment]"
  exit 1
fi

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
IMPL_FILE="results/${TASK_ID}-impl.json"
REVIEW_FILE="results/${TASK_ID}-review.json"
QA_FILE="results/${TASK_ID}-qa-checklist.json"

# ── impl.json の存在確認 ──────────────────────
if [ ! -f "$IMPL_FILE" ]; then
  echo "❌ ${IMPL_FILE} が見つかりません。先に on-impl-complete.sh を実行してください。"
  exit 1
fi

# ── comment の JSON エスケープ ────────────────
# ダブルクォートをエスケープ、改行を \n に変換
SAFE_COMMENT=$(printf '%s' "$COMMENT" | sed 's/\\/\\\\/g; s/"/\\"/g' | tr '\n' ' ')

# ── review.json 保存 ─────────────────────────
cat > "$REVIEW_FILE" <<JSONEOF
{
  "task_id": "${TASK_ID}",
  "timestamp": "${TIMESTAMP}",
  "verdict": "${VERDICT}",
  "comment": "${SAFE_COMMENT}",
  "reviewer": "claude-reviewer"
}
JSONEOF

echo "✓ レビュー結果保存: ${REVIEW_FILE}"

# ── FAIL: 差し戻し ───────────────────────────
if [ "$VERDICT" = "FAIL" ]; then
  echo ""
  echo "❌ レビュー FAIL: Implementer に差し戻します。"
  [ -n "$COMMENT" ] && echo "   理由: ${COMMENT}"
  exit 1
fi

# ── PASS: 変更ファイルから E2E チェックリスト生成 ─
CHANGED=$(grep '"changed_files"' "$IMPL_FILE" | sed 's/.*"changed_files": "\(.*\)".*/\1/')

# 一時ファイルに mktemp を使用
TMPFILE=$(mktemp)
trap 'rm -f "$TMPFILE"' EXIT

# 変更ファイルに応じて影響エージェントを特定
echo "$CHANGED" | tr '|' '\n' | while IFS= read -r f; do
  [ -z "$f" ] && continue
  case "$f" in
    agents/auth/*|app/\(auth\)/*|core/auth/*)       echo "AUTH" ;;
    agents/game-level/ui/HomeScreen*|app/\(game\)/home/*) echo "GAME_LEVEL" ;;
    agents/game-level/ui/StoryViewer*|app/\(game\)/game/*/learn/*) echo "STORY" ;;
    agents/quiz/*|app/\(game\)/game/*/quiz/*|app/\(game\)/game/game-over/*) echo "QUIZ" ;;
    agents/dictionary/*|app/\(game\)/dictionary/*)  echo "DICT" ;;
    core/utils/schemas*|core/*)                      echo "CORE" ;;
    app/page.tsx|middleware*)                        echo "ROUTING" ;;
    hooks/*|\.claude/*)                              echo "INFRA" ;;
  esac
done | sort -u > "$TMPFILE"

# チェックリスト JSON 構築
ITEMS=""
while IFS= read -r agent; do
  [ -z "$agent" ] && continue
  case "$agent" in
    AUTH)
      ITEMS="${ITEMS}{\"area\":\"認証\",\"checks\":[\"新規登録フォームで登録できる\",\"ログインできる\",\"無効パスワードでエラーが出る\",\"未認証で /home にアクセスすると /login にリダイレクトされる\"]},"
      ;;
    GAME_LEVEL)
      ITEMS="${ITEMS}{\"area\":\"ホーム・レベル選択\",\"checks\":[\"ログイン後にホーム画面が表示される\",\"免責事項モーダルが表示される\",\"同意後にレベル一覧が表示される\",\"Level 1 が開始できる\"]},"
      ;;
    STORY)
      ITEMS="${ITEMS}{\"area\":\"座学ビューア\",\"checks\":[\"Level 1 開始でストーリー1ページ目が表示される\",\"次へボタンでページが進む\",\"最終ページで クイズへ進む ボタンが表示される\"]},"
      ;;
    QUIZ)
      ITEMS="${ITEMS}{\"area\":\"クイズ・ゲームメカニクス\",\"checks\":[\"クイズ画面が表示される\",\"選択肢クリックでフィードバックが表示される\",\"コンプライアンスゲージが変動する\",\"Q3選択肢B でゲームオーバー画面に遷移する\",\"全問回答でレベルクリア画面に遷移する\"]},"
      ;;
    DICT)
      ITEMS="${ITEMS}{\"area\":\"ミニ辞書\",\"checks\":[\"辞書ページが表示される\",\"検索フォームで絞り込みができる\",\"用語クリックで定義が表示される\"]},"
      ;;
    CORE|ROUTING)
      ITEMS="${ITEMS}{\"area\":\"ルーティング・共通\",\"checks\":[\"/ にアクセスすると /login にリダイレクトされる\",\"未認証で保護ページにアクセスすると /login に飛ぶ\"]},"
      ;;
    INFRA)
      ITEMS="${ITEMS}{\"area\":\"フック・インフラ\",\"checks\":[\"bash hooks/on-impl-complete.sh <id> が PASS する\",\"コミット前に型チェックが実行される\"]},"
      ;;
  esac
done < "$TMPFILE"

# 末尾カンマ除去
ITEMS="${ITEMS%,}"

# チェックリストが空の場合のフォールバック
if [ -z "$ITEMS" ]; then
  ITEMS="{\"area\":\"全般\",\"checks\":[\"アプリが正常に起動する\",\"ログイン・ホーム・クイズの基本フローが動作する\"]}"
fi

cat > "$QA_FILE" <<JSONEOF
{
  "task_id": "${TASK_ID}",
  "timestamp": "${TIMESTAMP}",
  "status": "PENDING_HUMAN_E2E",
  "checklist": [${ITEMS}]
}
JSONEOF

echo ""
echo "✓ QA チェックリスト生成: ${QA_FILE}"
echo ""
echo "================================================================"
echo " 人間による E2E 確認をお願いします"
echo " チェックリスト: ${QA_FILE}"
echo "================================================================"
