# Self-Evolving AI Management OS — Web開発テンプレート

> GitHub: https://github.com/PIROSHKI1287/My_Deveropment

生物学的神経系（睡眠・MoE・アテンション局所化）にインスパイアされた、
Claude Codeとの協働を最大化するWeb開発テンプレート。

---

## このリポジトリの目的

Claude Codeでプロジェクトを始めるたびに、毎回ゼロからルールやディレクトリを設計しなくていいようにするためのベーステンプレート。
設計思想の詳細は [AI駆動ディレクトリ構造の最適化.md](AI駆動ディレクトリ構造の最適化.md) を参照。

---

## ディレクトリ構造

```
/
├── CLAUDE.md                  # AI指令の核心（大脳皮質）— 常に最初に読む
├── .clauderules               # 自動行動規則（本能）
│
├── docs/                      # 設計書・操作マニュアル（長期記憶）
│   ├── ARCHITECTURE.md        # 設計思想 + MoE構造の解説
│   └── OPERATING_GUIDE.md     # Claude Code操作マニュアル
│
├── plans/                     # 作業計画（前頭前皮質）— 何より先に書く
├── memories/                  # 経験・失敗の蓄積（海馬）
│   ├── raw_data/
│   ├── summaries/
│   └── lessons_learned/       # ここ → CLAUDE.mdへ週次蒸留
├── scratchpad/                # 一時作業領域（最終成果物に含めない）
│
├── core/                      # 全エージェント共通の基盤（脳幹）— 変更禁止に近い
│   ├── db/                    # DB接続・ORM
│   ├── auth/                  # 認証基盤
│   ├── middleware/            # 横断的関心事
│   └── utils/                 # 共通ユーティリティ
│
├── agents/                    # MoE専門家群（大脳新皮質の機能カラム）
│   ├── _shell/                # アプリシェル（ルーティング・レイアウト）
│   ├── _shared/               # 複数エージェント共有（連合野）
│   │   ├── ui/
│   │   └── logic/
│   ├── _template/             # 新機能追加時にコピーするひな形
│   │   ├── .clauderules       # 専門家の本能（責任範囲を記入）
│   │   ├── ui/
│   │   ├── api/
│   │   └── logic/
│   └── [feature-name]/        # _template/ をコピーして追加していく
│
├── tests/                     # テスト（unit/ / integration/）
└── infra/                     # インフラ設定（docker/ / ci/）
```

---

## 新しいプロジェクトを始めるとき

1. このリポジトリをクローン・フォーク
2. `CLAUDE.md` の `Mission` と `アーキテクチャ設定` を記入
3. `docs/ARCHITECTURE.md` の技術スタック決定セクションを記入
4. `agents/_template/` をコピーして機能ごとに `agents/[feature]/` を追加
5. `PROJECT_SETUP_GUIDE.md` でスタック別（Next.js / FastAPI / Supabase）の詳細手順を確認

---

## 設計の核心：なぜ agents/ に UI・API・ロジックを同居させるか

| 分割方式 | Claudeの動き | トークン効率 |
|---------|------------|------------|
| レイヤーベース（旧: src/ + api/） | 1機能の修正に複数ディレクトリを読む | 低 |
| **フィーチャーベース（agents/）** | `agents/[feature]/` 一箇所で完結 | **高** |

各 `agents/[feature]/` は `.clauderules` を持ち、Claudeがそのディレクトリに入った瞬間に「何をしてよくて何をしてはならないか」を本能的に知っている状態を作る。

---

## ドキュメント一覧

| ファイル | 内容 |
|---------|------|
| [CLAUDE.md](CLAUDE.md) | AI行動規則の核心（プロジェクトごとに記入） |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 設計思想・MoE構造・データフロー |
| [docs/OPERATING_GUIDE.md](docs/OPERATING_GUIDE.md) | Claude Codeの操作プロトコル |
| [PROJECT_SETUP_GUIDE.md](PROJECT_SETUP_GUIDE.md) | スタック別セットアップ手順 |
| [AI駆動ディレクトリ構造の最適化.md](AI駆動ディレクトリ構造の最適化.md) | 設計思想の論文（出典） |
