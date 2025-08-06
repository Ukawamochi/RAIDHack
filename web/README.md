# RAIDHack Web フロントエンド

このディレクトリには、RAIDHackプロジェクトのWebフロントエンドが含まれています。

## 開発環境

### 必要な環境
- Node.js 20以上
- npm

### ローカル開発の開始

1. 依存関係のインストール:
```bash
npm install
```

2. 開発サーバーの起動:
```bash
npm run dev
```
ブラウザで http://localhost:5173 が自動で開いてください。

3. APIサーバーも同時に起動してください:
```bash
# 別のターミナルで
cd ../api
npm run dev
```

### 本番ビルド

```bash
npm run build
```

ビルドされたファイルは `build/` フォルダに出力され、Cloudflare Pagesに自動デプロイされます。

## 環境変数

- `REACT_APP_API_BASE`: APIのベースURL
  - ローカル開発: `http://localhost:8787` (自動設定)
  - 本番環境: `https://raidhack-api.ukawamochi5.workers.dev` (CI/CDで設定)

## デプロイ

GitHubの`master`ブランチにプッシュすると、GitHub Actionsによって自動的にCloudflare Pagesにデプロイされます。
