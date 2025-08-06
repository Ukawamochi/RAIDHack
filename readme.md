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

**API**
```bash
npm install        # 初回のみ
npm run dev        # /apiで実行
```
- **URL**: http://localhost:8787

**Web**
```bash
cd web
npm install        # 初回のみ
npm run dev        # /webで実行
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

### Web (Cloudflare Pages)
- **フレームワーク**: Vite + React
- **言語**: TypeScript
- **スタイリング**: CSS
- **ビルドツール**: Vite

### CI/CD
- **プラットフォーム**: GitHub Actions
- **トリガー**: GithubへのPush
- **デプロイ先**: Cloudflare Workers + Pages



### 主要コマンド
```bash
# API開発サーバー起動
npm run dev          # = wrangler dev


