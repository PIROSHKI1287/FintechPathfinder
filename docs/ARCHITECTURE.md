# Architecture Document
# 設計思想: 生物学的AI管理OS

## なぜこの構造か

このプロジェクトは、AIエージェント（Claude Code）との協働効率を最大化するため、
生物神経系にインスパイアされたディレクトリ構造を採用する。

**核心原理**: AIの知性の高さは「常にリソースを使い続けること」ではなく、
「いつ休み、いつ思考を集中させるか」の制御に依存する。

---

## 生物学的アナロジー対応表

| ディレクトリ | 生物学的対応 | 役割 |
|-------------|------------|------|
| `CLAUDE.md` | 大脳皮質 | 過去の失敗から蒸留されたルール・制約・人格 |
| `.clauderules` | 本能・反射 | 意識的判断より前に発動する自動行動規則 |
| `docs/` | 長期記憶（静的） | 安定した参照知識。頻繁には変わらない |
| `core/` | 脳幹 | 生命維持に必要な基盤コード。滅多に変えない |
| `memories/` | 海馬 | 経験の蓄積・パターン抽出・CLAUDE.mdへの蒸留元 |
| `plans/` | 前頭前皮質 | 実行前シミュレーション。考えてから動く |
| `scratchpad/` | 作業記憶 | 一時的な計算空間。最終成果物に含めない |
| `agents/[feature]/` | 大脳新皮質の機能カラム | UI・API・ロジックを同居させた自己完結型専門家 |
| `agents/_shell/` | 運動野（出力系） | グローバルルーティング・レイアウト |
| `agents/_shared/` | 連合野 | 複数専門家が共有するUI・ロジック |

---

## MoE（混合専門家）構造

各 `agents/[feature]/` サブディレクトリは**自己完結型の専門家回路**を表す。

### レイヤーベース（旧・非推奨）vs フィーチャーベース（MoE原則）

```
❌ レイヤーベース（アテンション分散）      ✅ フィーチャーベース（アテンション局所化）
src/components/analyzer-ui/           agents/analyzer/
src/hooks/useAnalyzer.ts          →     ├── ui/        ← UIここだけ
api/services/analyzer.service.ts       ├── api/       ← APIここだけ
api/controllers/analyzer.ctrl.ts       ├── logic/     ← ロジックここだけ
                                        └── .clauderules ← 本能ここだけ
```

**効果**: Claudeが「analyzer を修正して」と言われたとき、
`agents/analyzer/` 一箇所だけ読めばよい。トークン消費が最小化される。

### 新規エージェントの追加手順
1. `agents/_template/` をコピーして `agents/[feature-name]/` を作成
2. `.clauderules` の「責任範囲」を記入する
3. `docs/ARCHITECTURE.md` の「重要な設計判断の記録」に追記する

---

## アテンション局所化（ノイズ抑制）

ディレクトリレベルの `.clauderules` はアテンション境界を強制する:
- Claudeは現在のタスクに関連するディレクトリの `.clauderules` のみを読む
- これはトランスフォーマーにおける「Localized Attention」を外部から強制することに等しい
- 効果: 幻覚リスクの低減、一貫性の向上

---

## 自己進化プロトコル

```
[生成フェーズ]   → /agents/[feature]/ へのコード出力（ui/・api/・logic/ に分離）
      ↓
[自己監査フェーズ] → /plans/validation_report.md への自己チェック記録
      ↓
[修正フェーズ]   → 監査結果に基づく CLAUDE.md の一時的なルール更新
      ↓
[反省フェーズ]   → /memories/lessons_learned/ の蒸留 → CLAUDE.md に統合
```

---

## [プロジェクト固有] 技術スタック決定
[プロジェクト開始時に記入]

```
決定内容:
理由:
受け入れたトレードオフ:
却下した選択肢:
```

---

## [プロジェクト固有] データフロー図
[プロジェクト開始時に記入]

```
[ユーザー] → [agents/_shell/ui] → [agents/[feature]/ui]
                                        → [agents/[feature]/api]
                                              → [agents/[feature]/logic]
                                                    → [core/db] → [DB]
```

---

## [プロジェクト固有] 重要な設計判断の記録

| 日付 | 判断内容 | 理由 | 代替案 |
|------|---------|------|--------|
| [YYYY-MM-DD] | [初期作成] | - | - |
