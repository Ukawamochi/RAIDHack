# RAIDHack! Project

## プロジェクト構成
- **API**: Cloudflare Workers (Hono フレームワーク)
- **Web**: Vite + React アプリケーション (Cloudflare Pages)
- **CI/CD**: GitHub Actions による自動デプロイ

## ローカル開発環境

### 前提条件
- Node.js 20以上
- npm

### 開発の開始

#### 方法1: 個別起動（推奨）

**ターミナル1 - API サーバー:**
```bash
cd api
npm install        # 初回のみ
npm run dev
```
- **URL**: http://localhost:8787
- **エンドポイント**: http://localhost:8787/message

**ターミナル2 - Web サーバー:**
```bash
cd web
npm install        # 初回のみ
npm run dev
```
- **URL**: http://localhost:5173
- **自動でAPI（localhost:8787）に接続**

#### 方法2: 同時起動
```bash
# ルートディレクトリで
npm install        # 初回のみ
npm run dev        # API + Web を同時起動
```

### 本番ビルドテスト（ローカル確認用）
```bash
cd web
npm run build      # dist/ フォルダに出力
```

## デプロイ

### 自動デプロイ（推奨）
```bash
git add .
git commit -m "update: 変更内容"
git push origin master
```
↓ **自動実行**
- API → Cloudflare Workers
- Web → Cloudflare Pages

### 緊急時の手動実行
GitHub ActionsのWebインターフェースから「Run workflow」

## 本番環境

### API
- **URL**: https://raidhack-api.ukawamochi5.workers.dev/
- **エンドポイント例**: https://raidhack-api.ukawamochi5.workers.dev/message

### Web
- **URL**: https://raidhack-web.pages.dev/

## 環境変数

### フロントエンド環境変数
| ファイル | 用途 | 値 |
|---------|------|-----|
| `web/.env.local` | ローカル開発 | `http://localhost:8787` |
| `web/.env` | 本番フォールバック | `https://raidhack-api.ukawamochi5.workers.dev` |
| CI/CD | 本番ビルド | `https://raidhack-api.ukawamochi5.workers.dev` |

### 使用方法
```javascript
// Reactコンポーネント内
const API_BASE = import.meta.env.VITE_API_BASE;
fetch(`${API_BASE}/message`);
```

## 技術スタック

### API (Cloudflare Workers)
- **フレームワーク**: Hono
- **言語**: TypeScript
- **デプロイツール**: Wrangler CLI
- **CORS**: 有効（フロントエンドアクセス用）

### Web (Cloudflare Pages)
- **フレームワーク**: Vite + React
- **言語**: TypeScript
- **スタイリング**: CSS
- **ビルドツール**: Vite

### CI/CD
- **プラットフォーム**: GitHub Actions
- **トリガー**: `master`ブランチへのpush
- **デプロイ先**: Cloudflare Workers + Pages

## Wrangler CLIについて

**Wrangler** = Cloudflareの公式開発ツール

### 用途
1. **Workers開発**: `wrangler dev` でローカルサーバー起動
2. **型生成**: TypeScript型定義の自動生成
3. **デプロイ**: CI/CDでの自動デプロイに使用
4. **設定管理**: `wrangler.toml`での環境設定

### 主要コマンド
```bash
# API開発サーバー起動
npm run dev          # = wrangler dev

# 型定義生成（必要時）
npm run cf-typegen   # = wrangler types
```

## トラブルシューティング

### よくある問題

1. **API接続エラー**: APIサーバーが起動していることを確認
2. **ポート競合**: 8787, 5173が使用中でないか確認
3. **環境変数**: `.env.local`ファイルが正しく設定されているか確認

### ログ確認
```bash
# API ログ
cd api && npm run dev

# Web ビルドエラー
cd web && npm run build
```

