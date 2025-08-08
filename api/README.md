# RAIDHack API セットアップガイド

## 1. データベースのセットアップ

### D1データベースの作成
```bash
cd api
wrangler d1 create raidhack-db
```

### データベースIDの設定
上記コマンドで出力されたデータベースIDを `wrangler.toml` の `database_id` に設定してください。

### スキーマの適用
```bash
wrangler d1 execute raidhack-db --file=./database/schema.sql
```

### サンプルデータの投入（開発環境）
```bash
wrangler d1 execute raidhack-db --file=./database/seed.sql
```

## 2. 環境変数の設定

### JWT秘密鍵の設定
```bash
# 開発環境
wrangler secret put JWT_SECRET --env development

# 本番環境
wrangler secret put JWT_SECRET --env production
```

推奨：ランダムな64文字以上の文字列を使用してください。

## 3. デプロイメント

### 開発環境へのデプロイ
```bash
npm run deploy:dev
```

### 本番環境へのデプロイ
```bash
npm run deploy:prod
```

## 4. APIエンドポイント

### 認証
- `POST /auth/register` - ユーザー登録
- `POST /auth/login` - ログイン
- `GET /auth/me` - 現在のユーザー情報取得（認証必須）

### アイデア
- `GET /ideas` - アイデア一覧取得（ページネーション対応）
- `GET /ideas/:id` - アイデア詳細取得
- `POST /ideas` - アイデア投稿（認証必須）
- `POST /ideas/:id/like` - いいね/いいね解除（認証必須）

### その他
- `GET /health` - ヘルスチェック
- `GET /` - API情報

## 5. 認証

### Bearerトークン認証
```
Authorization: Bearer <JWT_TOKEN>
```

### レスポンス例
```json
{
  "success": true,
  "message": "操作が完了しました",
  "user": { ... },
  "token": "eyJ..."
}
```

## 6. エラーハンドリング

### エラーレスポンス形式
```json
{
  "success": false,
  "message": "ユーザー向けエラーメッセージ",
  "error": "詳細なエラー情報"
}
```

## 7. 今後の実装予定

- [ ] チーム機能
- [ ] 応募システム
- [ ] 成果物投稿
- [ ] 投票機能
- [ ] 通知システム
- [ ] ファイルアップロード
