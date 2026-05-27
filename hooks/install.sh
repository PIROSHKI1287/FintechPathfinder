#!/usr/bin/env bash
# Usage: bash hooks/install.sh
# git hooks をインストールする。初回セットアップ時に一度だけ実行すること。

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GIT_HOOKS_DIR="${REPO_ROOT}/.git/hooks"

if [ ! -d "$GIT_HOOKS_DIR" ]; then
  echo "❌ .git/hooks ディレクトリが見つかりません。git リポジトリのルートで実行してください。"
  exit 1
fi

echo "▶ git hooks をインストールしています..."

# pre-commit
cp "${REPO_ROOT}/hooks/pre-commit.sh" "${GIT_HOOKS_DIR}/pre-commit"
chmod +x "${GIT_HOOKS_DIR}/pre-commit"
echo "  ✓ pre-commit → .git/hooks/pre-commit"

echo ""
echo "✓ インストール完了。コミット前に型チェックが自動実行されます。"
