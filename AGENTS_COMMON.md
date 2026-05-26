# AGENTS_COMMON.md — 全エージェント共通ルール v4.0
> **CLAUDE.md の次に全エージェントが読むファイル。**
> 更新権限: 人間（プロジェクトオーナー）のみ。

---

## 1. パイプライン全体図

```
人間
 ↕（タスク指示・承認・判断依頼）
Orchestrator（起動・集約・git・ログ・feature_list管理）
 ↓ 最大3並列
Implementer →PASS→ Reviewer →PASS→ QA →PASS→ Security →PASS→ Orchestrator
     ↑                ↓FAIL        ↓FAIL        ↓ALERT
     └────────────────┴────────────┘            ↓
          （差し戻し・上限3回）            Orchestrator
                                        （即時エスカレーション → 人間）

Doc Agent → Security PASS と並行して非同期起動（本流をブロックしない）
```

---

## 2. モデル自己決定

各エージェントはタスク開始前に `SKILL_MODEL_MAP.json` を参照し
担当スキルの `error_cost` に基づいてモデルを自己決定する。

複数スキルの場合: `error_cost` が最上位のスキルのモデルを採用する。

---

## 3. SECURITY_HALT チェック（全エージェント・省略厳禁）

**ファイル操作・コミット・次エージェント起動の前に必ず確認すること。**

```bash
if [ -f results/SECURITY_HALT ]; then
  echo "SECURITY_HALT を検知 → 作業を停止します"
  exit 1
fi
```

Security Alert 発生時:

```bash
cat > results/SECURITY_HALT <<EOF
{
  "detected_by": "{エージェント名}",
  "task_id": "{タスクID}",
  "reason": "{検知内容}",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "requires_human": true
}
EOF
bash hooks/on-security-alert.sh "{検知内容}" "{タスクID}"
```

---

## 4. コンテキスト引き継ぎの原則

後続エージェントには **判断に必要な最小情報のみ** を渡す。

| 引き継ぎ元 → 先 | 渡すもの | 渡さないもの |
|---|---|---|
| Orchestrator → Implementer | タスク概要・設計書ベース・制約 | 他タスクの情報 |
| Implementer → Reviewer | diffサマリー・lint/testサマリー・特記事項 | 実装コード全体 |
| Reviewer → QA | タスクID・懸念サマリー | レビュー全文・コード |
| QA → Security | タスクID・テスト結果サマリー | テストケース全体 |
| Security → Orchestrator | complete-{タスクID}.json（軽量） | 監査ログ全体 |

---

## 5. タスクID の採番ルール（ランダムID方式）

```bash
TASK_ID=$(node -e "
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for(let i=0; i<10; i++) id += chars[Math.floor(Math.random()*chars.length)];
  console.log(id);
")
```

---

## 6. 差し戻しルール

`results/{タスクID}-impl.json` の `rework_count` フィールドで管理する。

```
rework_count < 3  → 通常の差し戻し（Implementer が修正して再提出）
rework_count >= 3 → Orchestrator にエスカレーション（人間の判断を仰ぐ）
```

---

## 7. 禁止事項

- `AGENTS_COMMON.md` の自己編集（このファイルは人間専権）
- `CLAUDE.md` の大幅変更・削除・構造変更（失敗パターン早見表への蒸留追記のみ許可 → §8参照）
- `agents/*/.clauderules` の削除・大幅変更（本能強化の追記のみ許可 → §8参照）
- `hooks/` ディレクトリの自己編集（提案は `results/` に記録して人間に委ねる）
- `main` ブランチへの直接コミット
- `.env` のコミット・ログ出力
- `SECURITY_HALT` チェックの省略
- 差し戻し上限を超えた自己判断での続行
- コンテキスト肥大化を招く大量ファイル追加（コンテキスト削減が目的の場合は除く）
- DB マイグレーション・本番設定ファイル変更の無確認実行

---

## 8. 条件付き自己進化

以下は AI が自律的に実施してよい。

| 許可操作 | 条件 |
|---|---|
| `CLAUDE.md` 失敗パターン早見表への追記 | 既存行の削除・変更なし |
| `agents/[feature]/.clauderules` への本能ルール追記 | 既存行の削除・変更なし |
| `memories/lessons_learned/` への新規エントリ作成 | 既存ファイルの変更は最小限 |
| `memories/confirmation_history.md` の更新 | 定義されたフォーマットに従う |

**禁止継続（§8 の例外なし）:**
- `AGENTS_COMMON.md` 自体の変更
- `core/` 配下の変更
- 既存の `.clauderules` ルールの削除・弱体化
- コンテキスト肥大化（コンテキスト削減目的を除く）
