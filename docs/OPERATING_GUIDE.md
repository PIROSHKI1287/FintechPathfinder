# AI Operating Guide — Claude Code 操作マニュアル

## このドキュメントの目的
Claude Code自身が参照する操作マニュアル。
このシステムをどう使い、どう進化させるかを定義する。

---

## ファイル読み込み優先順位

1. `CLAUDE.md` — **常に最初に読む**（大脳皮質 = 最高優先）
2. 現在のタスクに関連するディレクトリの `.clauderules`
3. `docs/ARCHITECTURE.md` — 設計判断が必要な場合
4. `memories/lessons_learned/` — 過去の失敗確認

### 読み込み禁止（ノイズ抑制）
- `scratchpad/` の内容は最終成果物の判断に使わない
- `plans/` の古いアーカイブは参考程度（現在の判断基準ではない）

---

## タスク実行プロトコル

```
[タスク受信]
      ↓
[/plans/YYYY-MM-DD-{タスク名}.md に計画を書く] ← スキップ禁止
      ↓
[/memories/lessons_learned/ で関連失敗を確認]
      ↓
[/core/ や /api/models/ への変更を含む？]
      ├── YES → 計画を詳細化 → ユーザーに確認
      └── NO  → 実装開始
              ↓
         [/scratchpad/ で試行錯誤]
              ↓
         [本番コードに反映]
              ↓
         [自己監査: 実装は計画と一致しているか？]
              ↓
         [予想外があれば /memories/lessons_learned/ に記録]
              ↓
         [CLAUDE.md 更新が必要か判断]
```

---

## 定期メンテナンス（代謝フェーズ）

### 週次タスク
1. `memories/lessons_learned/` の新規エントリをレビュー
2. パターン化できる失敗を `CLAUDE.md` の制約セクションに蒸留
3. 完了した `plans/` を `memories/summaries/` にアーカイブ
4. `scratchpad/` の不要ファイルを削除

### 月次タスク
1. `docs/ARCHITECTURE.md` の技術スタック記述が現実と一致しているか確認
2. `core/` のコードが「本当に変えてはならないもの」か再評価
3. `CLAUDE.md` の制約数が適切か確認（多すぎると機能不全）

---

## 緊急時対応プロトコル

予期しない破壊的変更・インシデントが発生した場合:

1. **即座に作業停止**
2. `memories/lessons_learned/INCIDENT-YYYY-MM-DD.md` を作成
3. 以下を記録:
   - 何が起きたか
   - なぜ起きたか（根本原因）
   - 回復手順
   - 再発防止策
4. `CLAUDE.md` の「絶対制約」セクションを更新

---

## ディレクトリ変更ガイド（プロジェクト開始時）

`docs/ARCHITECTURE.md` の「技術スタック決定」セクションを記入後、
`PROJECT_SETUP_GUIDE.md` の指示に従って各ディレクトリを設定すること。
