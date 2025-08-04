# RAIDHack! Project
### ローカル環境での実行
#### API
```bash
npm run deploy:api
```

#### Web
```bash
npm run deploy:web
```

#### 両方とも実行する場合は:
```bash
npm run deploy
```

### デプロイ方法
> GitHub の master ブランチにプッシュすると、自動で CI/CD によるデプロイが実行されます。

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
### API
[APIのベースURL](https://api.ukawamochi5.workers.dev/)
フロントではURLを直接埋め込まないで${API_BASE}を使ってください。Pages側で環境変数を設定するので
### Web
[Pages](https://raidhack-web.pages.dev/)

