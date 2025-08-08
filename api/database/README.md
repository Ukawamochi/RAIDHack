# RAIDHack Platform - Cloudflare D1データベース設定手順

## 1. D1データベースの作成

```bash
# RAIDHack用データベースを作成
npx wrangler d1 create raidhack-database

# 出力例:
# ✅ Successfully created DB 'raidhack-database' in region APAC
# Created your database using D1's new storage backend. The new storage backend 
# is not yet recommended for production workloads, but backs up your data via 
# point-in-time restore.
# 
# [[d1_databases]]
# binding = "DB" # i.e. available in your Worker on env.DB
# database_name = "raidhack-database"
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

## 2. wrangler.tomlファイルの設定

上記コマンドの出力を`api/wrangler.toml`に追加：

```toml
name = "raidhack-api"
compatibility_date = "2025-01-21"

# D1データベース設定
[[d1_databases]]
binding = "DB"
database_name = "raidhack-database"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # 実際のIDに置き換え

# KVストレージ設定（セッション管理用）
[[kv_namespaces]]
binding = "SESSIONS"
id = "your-kv-namespace-id"
preview_id = "your-kv-preview-id"

# 環境変数
[vars]
JWT_SECRET = "your-super-secret-jwt-key-here"
DISCORD_BOT_TOKEN = "your-discord-bot-token-here"
```

## 3. データベーススキーマの適用

```bash
# ローカル環境にスキーマを適用
npx wrangler d1 execute raidhack-database --local --file=./database/schema.sql

# 本番環境にスキーマを適用
npx wrangler d1 execute raidhack-database --file=./database/schema.sql
```

## 4. 初期データの挿入（オプション）

```bash
# 初期データを挿入
npx wrangler d1 execute raidhack-database --local --file=./database/seed.sql
npx wrangler d1 execute raidhack-database --file=./database/seed.sql
```

## 5. データベース接続の確認

```bash
# ローカルでデータベースコンソールを開く
npx wrangler d1 execute raidhack-database --local --command="SELECT name FROM sqlite_master WHERE type='table';"

# 期待される出力:
# ┌──────────────────┐
# │ name             │
# ├──────────────────┤
# │ users            │
# │ ideas            │
# │ applications     │
# │ teams            │
# │ team_members     │
# │ works            │
# │ idea_likes       │
# │ work_votes       │
# └──────────────────┘
```

## 6. 開発環境でのデータベース操作

### 開発用データベースの起動
```bash
# API開発サーバー起動（D1ローカルDB含む）
cd api
npm run dev
```

### データベースへの直接アクセス
```bash
# ローカルD1データベースのコンソール
npx wrangler d1 execute raidhack-database --local

# SQLクエリ実行例
npx wrangler d1 execute raidhack-database --local --command="INSERT INTO users (email, username, password_hash) VALUES ('test@example.com', 'testuser', 'hashed_password');"
```

## 7. 本番環境デプロイ時の手順

### 本番データベースの確認
```bash
# 本番データベースの状態確認
npx wrangler d1 execute raidhack-database --command="SELECT COUNT(*) as user_count FROM users;"
```

### データベースバックアップ（推奨）
```bash
# 本番データベースのダンプ作成
npx wrangler d1 export raidhack-database --output=./backup/raidhack-$(date +%Y%m%d).sql
```

## 8. トラブルシューティング

### よくある問題と解決方法

1. **データベースIDが見つからない**
   ```bash
   npx wrangler d1 list
   ```

2. **スキーマ適用エラー**
   ```bash
   # テーブルが存在する場合は削除してから再作成
   npx wrangler d1 execute raidhack-database --local --command="DROP TABLE IF EXISTS users;"
   ```

3. **接続エラー**
   ```bash
   # wrangler.tomlファイルの設定を確認
   cat wrangler.toml
   ```

## 9. 開発ワークフロー

```bash
# 1. スキーマ変更時
vim database/schema.sql
npx wrangler d1 execute raidhack-database --local --file=./database/schema.sql

# 2. 開発サーバー起動
npm run dev

# 3. テスト実行
npm test

# 4. 本番デプロイ前にスキーマ適用
npx wrangler d1 execute raidhack-database --file=./database/schema.sql

# 5. デプロイ
npm run deploy
```

## 10. データベース監視とメンテナンス

### メトリクス確認
```bash
# データベース使用量確認
npx wrangler d1 info raidhack-database
```

### パフォーマンス監視
```bash
# スロークエリ確認（Cloudflare Dashboardで確認）
# https://dash.cloudflare.com/ > Workers & Pages > D1
```

## セキュリティ注意事項

1. **JWT_SECRET**: 本番環境では十分に複雑な秘密鍵を使用
2. **パスワードハッシュ**: bcryptまたはscryptを使用
3. **SQL インジェクション対策**: 常にパラメータ化クエリを使用
4. **データ暗号化**: 機密データは暗号化して保存

これで、RAIDHackプラットフォーム用のCloudflare D1データベースが設定できます。
