#!/usr/bin/env bash
# Claude Code PostToolUse(Write|Edit) hook
# .ts/.tsx ファイルが変更された場合のみ型チェックを実行する

CHANGED=$(git diff --name-only 2>/dev/null | grep -E '\.(ts|tsx)$' | head -1)
if [ -n "$CHANGED" ]; then
  npm run type-check --silent 2>&1 | tail -5
fi
