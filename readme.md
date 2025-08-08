# 🎯 RAIDHack - ハッカソンプラットフォーム

> **Googleのようなシンプルで使いやすいハッカソンプラットフォーム**
> 
> アイデア投稿からチーム形成、開発、成果物共有、投票まで一気通貫で提供

## ✨ 特徴

- 🚀 **シンプル & 直感的**: 複雑な機能を排除し、本質的な機能のみに集中
- ⚡ **高速**: Cloudflareエコシステムによる世界規模の高パフォーマンス
- 🔒 **セキュア**: JWT認証とCloudflareのセキュリティ機能
- 📱 **レスポンシブ**: モバイルフ## 📞 サポート・お問い合わせ

- **🐛 バグ報告**: [GitHub Issues](https://github.com/Ukawamochi/RAIDHack-api/issues)
- **💬 質問・議論**: [GitHub Discussions](https://github.com/Ukawamochi/RAIDHack-api/discussions)  
- **📖 詳細ガイド**: [LOCAL_SETUP.md](./LOCAL_SETUP.md)

---

**開発サーバー起動方法**:
- **API**: `cd api && npm run dev` → http://localhost:8787
- **Web**: `cd web && npm run dev` → http://localhost:5173

**デプロイ**: GitHub Actionsによる自動CI/CD（masterブランチpush時）予定）
- 🛠️ **開発者フレンドリー**: TypeScript完全対応、包括的なAPI

## 🚀 ローカル開発方法

### 📋 前提条件
- **Node.js 18+** (推奨: 20.x LTS)
- **Cloudflareアカウント**
- **Git**

### 🛠️ 初期セットアップ（初回のみ）

#### 1. プロジェクトのクローンとWrangler設定
```bash
git clone https://github.com/Ukawamochi/RAIDHack-api.git
cd RAIDHack

# Wrangler CLI インストール
npm install -g wrangler

# Cloudflareログイン
wrangler login
```

#### 2. データベースセットアップ
```bash
cd api

# D1データベース作成
wrangler d1 create raidhack-db
# ↓ 出力例:
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# wrangler.tomlのdatabase_idを上記の値に更新
# [[d1_databases]]
# binding = "DB"
# database_name = "raidhack-db"
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # ここを更新

# スキーマとサンプルデータを投入
wrangler d1 execute raidhack-db --file=./database/schema.sql
wrangler d1 execute raidhack-db --file=./database/seed.sql
```

#### 3. 環境変数設定
```bash
# JWT秘密鍵生成（例）
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 開発環境に秘密鍵設定
wrangler secret put JWT_SECRET --env development
# プロンプトで上記で生成した秘密鍵を入力
```

### 🏃‍♂️ 日常的な開発実行

#### APIサーバーの起動
```bash
cd api
npm install    # 初回のみ
npm run dev
```
**成功すると**: `http://localhost:8787` でAPIが起動

#### フロントエンドの起動（テスト用）
```bash
cd web
npm install    # 初回のみ
npm run dev
```
**成功すると**: `http://localhost:5173` でWebページが起動

#### 動作確認
```bash
# ヘルスチェック
curl http://localhost:8787/health

# API情報取得
curl http://localhost:8787/

# アイデア一覧取得（サンプルデータ）
curl http://localhost:8787/ideas
```

### 🧪 APIテスト例

#### ユーザー登録
```bash
curl -X POST http://localhost:8787/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "bio": "テストユーザーです",
    "skills": ["JavaScript", "TypeScript"]
  }'
```

#### ログイン
```bash
curl -X POST http://localhost:8787/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com", 
    "password": "password123"
  }'
```

#### アイデア投稿（認証必須）
```bash
# 上記のログインレスポンスからtokenを取得して使用
curl -X POST http://localhost:8787/ideas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "新しいハッカソンアイデア",
    "description": "AIを活用した革新的なアプリケーション",
    "requiredSkills": ["AI", "Python", "React"]
  }'
```

## 🎯 実装状況

### ✅ 完了済み（現在利用可能）
- 🔐 **認証システム**: ユーザー登録・ログイン・JWT認証
- 💡 **アイデア管理**: 投稿・一覧・詳細・いいね機能・ページネーション
- 🗄️ **データベース**: 完全なスキーマ設計（8テーブル）
- 📊 **サンプルデータ**: 5ユーザー・5アイデア・チーム情報

### 🔄 実装予定
- **Phase 2**: チーム・応募機能の実装
- **Phase 3**: 成果物・投票システム
- **Phase 4**: フロントエンド開発（React）
- **Phase 5**: 通知・ファイルアップロード

## 📖 現在利用可能なAPI仕様

### 🔐 認証
```
POST /auth/register     # ユーザー登録
POST /auth/login        # ログイン  
GET  /auth/me          # ユーザー情報取得（認証必須）
```

### 💡 アイデア
```
GET  /ideas             # アイデア一覧（ページネーション対応）
GET  /ideas/:id         # アイデア詳細
POST /ideas             # アイデア投稿（認証必須）
POST /ideas/:id/like    # いいね切り替え（認証必須）
```

### 🔧 その他
```
GET  /health           # ヘルスチェック
GET  /                # API情報・エンドポイント一覧
```

## 🛠️ 技術スタック

- **API**: Cloudflare Workers + Hono v4.0+ + D1 (SQLite) + TypeScript
- **Frontend**: React 19 + Vite + TypeScript
- **認証**: JWT (hono/jwt) - 7日間有効トークン
- **デプロイ**: GitHub Actions (CI/CD自動化)

## 🚀 デプロイ

**自動デプロイ**: masterブランチへのpushで自動実行
```bash
git add .
git commit -m "feat: 新機能追加"
git push origin master
```
↓ **GitHub Actionsが自動実行**
- API → Cloudflare Workers
- Web → Cloudflare Pages

## 🔧 開発用コマンド

```bash
# APIサーバー起動
cd api && npm run dev

# フロントエンド起動
cd web && npm run dev

# 型チェック
cd api && npm run type-check

# データベース操作
cd api && npm run db:schema    # スキーマ適用
cd api && npm run db:seed      # サンプルデータ投入
cd api && npm run db:query -- --command="SELECT * FROM users"
```

## 🐛 よくあるトラブルと解決策

### ❌ Database binding not found
- **原因**: `wrangler.toml`の`database_id`未設定
- **解決**: `wrangler d1 create raidhack-db`で作成したIDを設定

### ❌ JWT secret not found  
- **原因**: 環境変数未設定
- **解決**: `wrangler secret put JWT_SECRET --env development`

### ❌ TypeScript compilation failed
- **原因**: 型エラー
- **解決**: `cd api && npm run type-check`で確認、`types.ts`を修正

### ❌ Wrangler command not found
- **原因**: Wrangler CLI未インストール
- **解決**: `npm install -g wrangler`

## 📁 プロジェクト構成

```
RAIDHack/
├── 📄 readme.md                # このファイル（プロジェクト概要）
├── 📄 AI_RULES.md              # チーム開発統一ルール
├── 📄 LOCAL_SETUP.md           # 詳細なセットアップガイド
├── 📂 api/                     # バックエンドAPI
│   ├── 📂 src/                 # TypeScriptソースコード
│   ├── 📂 database/            # スキーマ・サンプルデータ
│   ├── 📄 wrangler.toml        # Cloudflare設定
│   └── 📄 package.json         # 依存関係・スクリプト
└── 📂 web/                     # フロントエンド（React + Vite）
    ├── 📂 src/                 # Reactソースコード
    ├── 📄 vite.config.ts       # Vite設定
    └── 📄 package.json         # 依存関係・スクリプト
```

## 🤝 開発に参加する

### 開発ルール
1. **[AI開発ルール](./AI_RULES.md)** を必ず確認
2. **型安全性最優先** - `any`型禁止、全型定義を`types.ts`に集約
3. **統一レスポンス形式** - `success`, `message`必須
4. **セキュリティ重視** - JWT・環境変数・SQLインジェクション対策
5. **シンプル設計** - Googleライクなミニマルデザイン

### 貢献方法
```bash
# 1. フォーク・クローン
git clone YOUR_FORK_URL
cd RAIDHack

# 2. 機能ブランチ作成
git checkout -b feature/amazing-feature

# 3. 開発・テスト
cd api && npm run dev    # API開発
cd web && npm run dev    # フロントエンド開発

# 4. コミット・プッシュ
git commit -m "feat: 素晴らしい機能追加"
git push origin feature/amazing-feature

# 5. プルリクエスト作成
```

## � サポート・お問い合わせ

- **� バグ報告**: [GitHub Issues](https://github.com/Ukawamochi/RAIDHack-api/issues)
- **💬 質問・議論**: [GitHub Discussions](https://github.com/Ukawamochi/RAIDHack-api/discussions)  
- **� 詳細ガイド**: [LOCAL_SETUP.md](./LOCAL_SETUP.md)

---

**注意**: `/web`ディレクトリは旧フロントエンド環境です。現在はAPIのみに集中して開発中のため、`npm run dev`は`/api`ディレクトリで実行してください。


