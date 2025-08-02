# RAIDHack! Project

### デプロイ方法
Cloudflareのアカウントを持っているうかわ以外はこのコマンドは役には立たないと思われます。ただローカルで実行する以下のコマンドは使えるはずです。もしかしたらCloudflareにログインを求められる
```bash
npm run dev
```
#### API
```bash
npm run deploy:api
```

#### フロントエンド
```bash
npm run deploy:web
```

> 両方とも実行する場合は:
```bash
npm run deploy
```

> GitHub の main ブランチにプッシュすると、自動で CI/CD によるデプロイが実行されます。
