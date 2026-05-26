# CLAUDE.md — AI Operating System Core v4.0
> **全エージェントが最初に読む唯一のファイル。更新権限: 人間のみ。**

---

## Mission
[プロジェクト開始時に1文で記入: このシステムは何をするか]

---

## ファイル読み込み順序（省略禁止・毎セッション必須）

```
CLAUDE.md（今ここ）→ AGENTS_COMMON.md → agents/{ロール}/.clauderules
```

| ロール | 読む順序 |
|---|---|
| Orchestrator | CLAUDE.md → AGENTS_COMMON.md → agents/_orchestrator/.clauderules |
| Implementer | CLAUDE.md → AGENTS_COMMON.md → agents/_implementer/.clauderules |
| Reviewer | CLAUDE.md → AGENTS_COMMON.md → agents/_reviewer/.clauderules |
| QA Agent | CLAUDE.md → AGENTS_COMMON.md → agents/_qa/.clauderules |
| Security Agent | CLAUDE.md → AGENTS_COMMON.md → agents/_security/.clauderules |
| Doc Agent | CLAUDE.md → AGENTS_COMMON.md → agents/_doc/.clauderules |

**自分のロール以外の agents/*/ は読まない（コンテキスト汚染を防ぐ）。**

---

## 絶対制約（違反禁止）

1. **計画先行**: 何の作業も `plans/YYYY-MM-DD-{タスク概要}.md` の作成・保存なしに開始してはならない。Claude Code のプランモードだけに保存するのは禁止。必ずファイルとして書き出す。
2. **/core/ 保護**: `/core/` は明示的な指示なしに変更禁止。変更前に依存関係を全列挙すること
3. **失敗記録**: 予想外の動作・エラーが発生したら即座に `memories/lessons_learned/` に記録。`bash hooks/on-error.sh "内容" "タスクID"` で自動記録する。
4. **認証情報ゼロトレランス**: APIキー・パスワード・トークンをコードにハードコード禁止（`.env` を使用）
5. **破壊的操作の確認**: ファイル削除・DBマイグレーション・本番反映は必ず人間に確認を取る
6. **SECURITY_HALT**: `results/SECURITY_HALT` が存在する場合は即時全作業停止。削除は人間のみ許可。
7. **scratchpad 使用**: 試行錯誤・検証コードは必ず `scratchpad/` に書く。直接プロダクションコードに書かない。

---

## アーキテクチャ設定
[プロジェクト開始時に記入 — docs/ARCHITECTURE.md も同時更新すること]

```
フレームワーク (Frontend) : [例: Next.js 15 / React 19]
フレームワーク (Backend)  : [例: FastAPI / Express / Hono]
データベース              : [例: PostgreSQL / Supabase / MongoDB]
認証                      : [例: NextAuth / Clerk / Firebase Auth]
インフラ                  : [例: Vercel / Railway / AWS]
主要パターン              : [例: Repository Pattern / Server Actions / REST]
```

詳細は `docs/ARCHITECTURE.md` を参照すること。

---

## 品質ゲート（main へのマージ判定基準）

以下をすべて満たさない限りマージしない。

| 観点 | 基準 |
|---|---|
| 型チェック | 型エラー 0件（プロジェクトの lint/type-check コマンドを使用） |
| CI | GitHub Actions green（lint + test PASS） |
| レビュー | Critical / High 指摘ゼロ |
| セキュリティ | Security Agent 監査 PASS |
| 動作確認 | 実際に手動動作確認済み |
| ドキュメント | `memories/lessons_learned/` に記録済み |

---

## 失敗パターン早見表

詳細: `memories/lessons_learned/`

| カテゴリ | パターン | 対策 |
|---|---|---|
| フェーズ管理 | Phase 完了を早まった（push 漏れ・自己進化未実行・外部サービス未確認） | フェーズ完了チェックリストを全項完了してから「完了」 |
| plans | Claude Code プランモードだけに計画保存 → `plans/` が空のまま | 承認後即座に `plans/YYYY-MM-DD-{概要}.md` をファイルとして書き出す |
| scratchpad | 検証コードを直接 src/ に書いてそのまま残る | 試行錯誤は必ず `scratchpad/` に書き、完了後に削除する |
| results | エージェント間の状態がメモリ上のみで消える | 引き継ぎは必ず `results/{タスクID}-*.json` に書き出す |
| feature_list | `status=READY` でも実装済みコードが存在する場合がある | タスク開始前に必ず Glob でファイル探索して実装状況を確認してから計画を立てる |
| .clauderules | 業務ルールのみ記載で技術的制約が抜ける → 既知バグの再発 | バグ発生時は即座に該当 `.clauderules` に技術的本能ルールとして追記する |

---

## lessons_learned 蒸留サイクル

**蒸留タスクを起動する条件（OR・どちらか早い方）:**

| 条件 | 説明 |
|---|---|
| A. 未蒸留ファイルが **5件** に達した | 活発な開発期に自動発火 |
| B. 前回の蒸留から **30日** 経過 | 低活動期のフォールバック（最低限の振り返りを保証） |

**実行手順（Orchestrator がセッション開始時に最優先で処理）:**

1. 未蒸留ファイルを精査（5件 or 蓄積分）
2. `CLAUDE.md` の「失敗パターン早見表」に一般化・統合  
   （重複は統合、特殊すぎるものは削除、類似ルールがあれば強化）
3. 蒸留済みファイルを `memories/summaries/distilled/` へ移動
4. 蒸留完了日時を `memories/confirmation_history.md` に記録

**判断基準:**

| 分類 | 処置 |
|---|---|
| 再発可能性が高い（構造的な問題） | CLAUDE.md に昇格 |
| プロジェクト固有で再発性が低い | `summaries/` にアーカイブ |
| 既存ルールに類似あり | 既存ルールを強化して削除 |

> **現在の蒸留状態**: 未蒸留ファイル 0件（クリーン）  
> 前回蒸留: [初期作成のため未実施]

---

## 優先順位
**セキュリティ > 正確性 > パフォーマンス > 可読性**

---

## ディレクトリ読み込みルール

| タスク種別 | 追加で読む場所 |
|---|---|
| 設計判断 | `docs/ARCHITECTURE.md` |
| 過去の失敗確認 | `memories/lessons_learned/` |
| コア変更 | `core/.clauderules` → 計画必須 |
| モデル選択 | `SKILL_MODEL_MAP.json` |
| タスク状況確認 | `feature_list.json` / `results/` |

---

## タスク開始プロトコル（毎回必須・省略禁止）

作業の種類を問わず、以下を順番に実行してからコードに触れること。

1. `results/SECURITY_HALT` の存在確認 → あれば即停止
2. `feature_list.json` で対象タスクのステータスを確認
3. `memories/lessons_learned/` で関連する過去の失敗を確認
4. **`plans/YYYY-MM-DD-{タスク概要}.md` をファイルとして作成・保存**（これをしないと作業開始不可）
5. スコープ確認: `core/` または `agents/_shared/` への変更を含むか？→ 含む場合は計画を詳細化

---

## タスク完了プロトコル（毎回必須・省略禁止）

1. 型チェック・lint — エラー 0件を確認
2. 手動動作確認
3. `results/{タスクID}-complete.json` を作成してパイプライン完了を記録  
   （`used_model` フィールドに実際に使用したモデルIDを記録すること）
4. `memories/lessons_learned/YYYY-MM-DD-{タスク名}.md` を作成
5. `CLAUDE.md` の失敗パターン早見表に新規パターンを自律追記（あれば）
6. `scratchpad/` の一時ファイルを削除
7. `feature_list.json` の当該タスクの status を COMPLETE に更新
8. `git commit && git push`
9. 完了した plans を `memories/summaries/` にアーカイブ
10. セッション中に人間が確認した操作を `memories/confirmation_history.md` に記録
11. `memories/lessons_learned/` の未蒸留ファイルが 5件以上なら蒸留タスクをスケジュール

---

## メタデータ
- 最終更新: 2026-05-12
- 更新理由: v4.0 — Tessid S評価知見を標準環境へ反映（ファイル読み込み順序・SECURITY_HALT・品質ゲート・失敗パターン早見表・蒸留サイクル・タスクプロトコル）
- GitHub: https://github.com/PIROSHKI1287/My_Deveropment
