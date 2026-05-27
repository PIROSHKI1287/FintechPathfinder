#!/usr/bin/env bash
# git pre-commit hook
# hooks/install.sh で .git/hooks/pre-commit にコピーされる。
# コミット前に型チェックを実行し、エラーがあればコミットをブロックする。

set -uo pipefail

echo "▶ [pre-commit] 型チェック実行中..."

if ! npm run type-check --silent 2>&1; then
  echo ""
  echo "❌ [pre-commit] TypeScript 型エラーがあります。コミットをブロックしました。"
  echo "   npm run type-check で詳細を確認してください。"
  exit 1
fi

echo "✓ [pre-commit] 型チェック PASS"
