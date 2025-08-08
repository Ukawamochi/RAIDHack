# 🚀 RAIDHack ローカル開発ガイド

## 📋 前提条件

### 必要なツール
- **Node.js 18+** (推奨: 20.x LTS)
- **npm** または **yarn**
- **Git**

### Cloudflare関連
- **Cloudflareアカウント**
- **Wrangler CLI** (Cloudflare Workers用)

## 🛠️ 初期セットアップ

### 1. プロジェクトのクローン
```bash
git clone https://github.com/Ukawamochi/RAIDHack-api.git
cd RAIDHack
```

### 2. Wrangler CLIのインストール
```bash
# グローバルインストール（推奨）
npm install -g wrangler

# またはプロジェクト内
npm install --save-dev wrangler
```

### 3. Cloudflareにログイン
```bash
wrangler login
# ブラウザが開くのでCloudflareアカウントでログイン
```

## 🗄️ データベースセットアップ

### 1. D1データベースの作成
```bash
cd api
wrangler d1 create raidhack-db
```

実行結果例：
```
✅ Successfully created DB 'raidhack-db' in region APAC
Created your database using D1's new storage backend.

[[d1_databases]]
binding = "DB"
database_name = "raidhack-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 2. wrangler.tomlの更新
出力された`database_id`を`api/wrangler.toml`に設定：

```toml
[[d1_databases]]
binding = "DB"
database_name = "raidhack-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # ここを更新
```

### 3. スキーマの適用
```bash
cd api
wrangler d1 execute raidhack-db --file=./database/schema.sql
```

### 4. サンプルデータの投入
```bash
wrangler d1 execute raidhack-db --file=./database/seed.sql
```

### 5. データベース確認
```bash
# テーブル一覧確認
wrangler d1 execute raidhack-db --command="SELECT name FROM sqlite_master WHERE type='table'"

# ユーザーデータ確認
wrangler d1 execute raidhack-db --command="SELECT * FROM users"
```

## 🔐 環境変数の設定

### JWT秘密鍵の生成と設定
```bash
# 安全な秘密鍵を生成（例）
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 開発環境に設定
wrangler secret put JWT_SECRET --env development
# 入力プロンプトで上記で生成した秘密鍵を入力

# 本番環境に設定（後で）
wrangler secret put JWT_SECRET --env production
```

## 🏃‍♂️ ローカル開発実行

### APIサーバーの起動
```bash
cd api
npm install
npm run dev
```

成功すると：
```
⛅️ wrangler 3.x.x
--------------------------------------------------
⬣ Listening at http://localhost:8787
- http://localhost:8787/health
- http://localhost:8787/
```

### 動作確認
```bash
# ヘルスチェック
curl http://localhost:8787/health

# API情報取得
curl http://localhost:8787/

# アイデア一覧取得
curl http://localhost:8787/ideas
```

## 🧪 API テスト方法

### 1. ユーザー登録
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

### 2. ログイン
```bash
curl -X POST http://localhost:8787/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

レスポンスからトークンを取得：
```json
{
  "success": true,
  "message": "ログインに成功しました",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 3. 認証が必要なAPI（アイデア投稿）
```bash
curl -X POST http://localhost:8787/ideas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "title": "新しいハッカソンアイデア",
    "description": "AIを活用した革新的なアプリケーション",
    "requiredSkills": ["AI", "Python", "React"]
  }'
```

## 🔧 開発中のよくある操作

### データベースの操作
```bash
# 特定のテーブルの内容確認
wrangler d1 execute raidhack-db --command="SELECT * FROM ideas"

# データの追加（直接SQL実行）
wrangler d1 execute raidhack-db --command="INSERT INTO users (email, username, password_hash) VALUES ('admin@example.com', 'admin', 'hashed_password')"

# データの削除
wrangler d1 execute raidhack-db --command="DELETE FROM ideas WHERE id = 1"
```

### ログの確認
```bash
# ローカル開発時のログはターミナルに表示
# Ctrl+C で停止

# 本番環境のログ確認
wrangler tail
```

### 環境変数の確認
```bash
# 設定済み秘密変数の一覧
wrangler secret list

# 特定の環境の秘密変数一覧
wrangler secret list --env development
```

## 🚀 デプロイ方法

### 開発環境へのデプロイ
```bash
npm run deploy:dev
# または
wrangler deploy --env development
```

### 本番環境へのデプロイ
```bash
npm run deploy:prod
# または  
wrangler deploy --env production
```

### デプロイ後の確認
```bash
# デプロイされたURLにアクセス
curl https://your-worker.your-subdomain.workers.dev/health
```

## 🐛 トラブルシューティング

### よくある問題と解決策

#### 1. データベース接続エラー
```
Error: Database binding not found
```
**解決策**: `wrangler.toml`の`database_id`が正しく設定されているか確認

#### 2. JWT認証エラー
```
Error: JWT secret not found
```
**解決策**: `wrangler secret put JWT_SECRET`で秘密鍵を設定

#### 3. 型エラー
```
TypeScript compilation failed
```
**解決策**: `npm run type-check`で型チェック、`types.ts`の定義確認

#### 4. CORS エラー
```
Access to fetch blocked by CORS policy
```
**解決策**: フロントエンドからのリクエスト時は正しいヘッダーを設定

### ログレベルの設定
```bash
# 詳細ログを表示
wrangler dev --log-level debug

# 本番環境のログ監視
wrangler tail --format json
```

## 📚 追加リソース

### 公式ドキュメント
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Hono](https://hono.dev/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### プロジェクト固有
- [API仕様書](./api/README.md)
- [データベース設計](./api/database/README.md)
- [AI開発ルール](./AI_RULES.md)

---

**注意**: ローカル開発環境では実際のCloudflare D1ではなく、ローカルのSQLiteが使用される場合があります。本番環境と完全に同じ環境でテストする場合は、`wrangler dev --remote`を使用してください。
