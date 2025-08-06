# RAIDHack! Project

## プロジェクト構成
- **API**: Cloudflare Workers (Hono フレームワーク)
- **Web**: React アプリケーション (Cloudflare Pages)
- **CI/CD**: GitHub Actions による自動デプロイ

## ローカル開発環境

### 前提条件
- Node.js 20以上
- npm

### 1. API のローカル実行

**ターミナル1を開いて以下を実行:**
```bash
cd api
npm install        # 初回のみ
npm run dev
```
- **ポート**: http://localhost:8787 または http://127.0.0.1:8787
- **API エンドポイント例**: http://localhost:8787/message
- **停止方法**: Ctrl+C

### 2. Web のローカル実行

**ターミナル2を開いて以下を実行:**
```bash
cd web
npm install        # 初回のみ
npm start
```
- **ポート**: http://localhost:3000
- **自動ブラウザ起動**: あり（通常は自動で開きます）
- **停止方法**: Ctrl+C

### 注意事項
- **API を先に起動**してから Web を起動してください
- Web アプリは自動的に localhost:8787 の API に接続します
- ブラウザが自動で開かない場合は、手動で http://localhost:3000 にアクセスしてください

## デプロイ方法
GitHub の `master` ブランチにプッシュするとデプロイされます。

手動でのデプロイコマンドは不要です。
## 本番環境

### API
https://raidhack-api.ukawamochi5.workers.dev/

### Web
https://raidhack-web.pages.dev/

## 環境変数設定
**フロントエンドの環境変数の仕組み:**
- ローカル開発: `.env.local` → `http://localhost:8787`
- 本番環境: CI/CD環境変数 → `https://raidhack-api.ukawamochi5.workers.dev`
- フロントエンドでは `process.env.REACT_APP_API_BASE` を使用

| ファイル | 用途 | 値 |
|---------|------|-----|
| `web/.env.local` | ローカル開発 | `http://localhost:8787` |
| `web/.env` | 本番フォールバック | `https://raidhack-api.ukawamochi5.workers.dev` |
| CI/CD | 本番ビルド | `https://raidhack-api.ukawamochi5.workers.dev` |

