# Service Binding実装案

## 現在の構成
```
Cloudflare Pages (Frontend) → HTTP Request → Cloudflare Workers (API)
```

## バインディング使用時の構成
```
Cloudflare Pages (Frontend with Functions) → Direct Service Call → Cloudflare Workers (API)
```

## 実装方法

### 1. Cloudflare Pages Functions を使用
`web/functions/api/[...slug].js`:
```javascript
export async function onRequest(context) {
  // Service Bindingを使ってWorkerを直接呼び出し
  const response = await context.env.API_SERVICE.fetch(context.request);
  return response;
}
```

### 2. wrangler.toml でバインディング設定
```toml
[[services]]
binding = "API_SERVICE"
service = "raidhack-api"
```

### 3. フロントエンド側は相対パスで呼び出し
```javascript
// HTTPリクエストではなく、Pages Functionsを経由した内部呼び出し
fetch('/api/message')
```

## メリット
- **レイテンシー**: ~50ms → ~5ms
- **セキュリティ**: 完全にプライベート通信
- **コスト**: リクエスト数削減
- **信頼性**: 内部ネットワークのため高い可用性
