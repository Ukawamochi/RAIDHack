# Cloudflare Pages 直接連携の設定手順

## 1. Cloudflare Dashboardでの設定

1. Cloudflare Dashboard → Pages → Create application
2. "Connect to Git" を選択
3. GitHubアカウント連携
4. `RAIDHack` リポジトリを選択
5. Build設定:
   - Framework preset: React
   - Build command: `cd web && npm ci && npm run build`
   - Build output directory: `web/dist`
   - Root directory: `/` (リポジトリのルート)

## 2. 環境変数の設定

Pages設定で以下の環境変数を追加:
- `VITE_API_BASE`: `https://raidhack-api.workers.dev`


## 3. Production branchの設定

- Production branch: `master`
- これにより、masterブランチへのpushで自動的に本番環境が更新される

## 利点

- GitHubへのpushで自動的に本番環境が更新
- Cloudflare Pagesの最適化されたビルド環境
- キャッシュの自動最適化
- より詳細なデプロイログ

## API URLの確認方法

実際のCloudflare Workers APIのURLを確認するには：

1. **Cloudflare Dashboard**で確認:
   - https://dash.cloudflare.com/ → Workers & Pages
   - デプロイされた`raidhack-api`をクリック
   - URLが表示されます

2. **コマンドラインで確認**:
   ```bash
   cd api
   npx wrangler whoami  # アカウント情報確認
   npx wrangler list    # デプロイされたWorkers一覧
   ```

3. **実際のデプロイで確認**:
   - GitHub ActionsのAPIデプロイログを確認
   - wranglerの出力から実際のURLを取得
