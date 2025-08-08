# RAIDHack開発 AIルールプロンプト

## 📋 プロジェクト概要
RAIDHackは、**Googleのようなシンプルで使いやすいハッカソンプラットフォーム**です。アイデア投稿、チーム形成、開発、成果物共有、投票までの一連の流れを提供します。

## 🎯 設計思想
- **シンプルさ第一**: 複雑な機能は避け、必要最小限で直感的なUI/UX
- **モダン技術スタック**: TypeScript完全対応、型安全性重視
- **スケーラブル設計**: Cloudflareエコシステムを活用した高パフォーマンス
- **開発者体験優先**: 明確なAPI設計、包括的なドキュメント

## 🏗️ 技術アーキテクチャ

### バックエンド (Cloudflare Workers)
- **フレームワーク**: Hono v4.0+
- **データベース**: Cloudflare D1 (SQLite)
- **認証**: JWT (hono/jwt) - 7日間有効
- **言語**: TypeScript (strict mode)

### フロントエンド (Cloudflare Pages)
- **フレームワーク**: React 18+ + Vite
- **言語**: TypeScript (strict mode)
- **スタイリング**: TailwindCSS (予定)
- **状態管理**: React Hooks + Context API

### インフラ
- **デプロイ**: Cloudflare Workers/Pages
- **CI/CD**: GitHub Actions
- **環境管理**: wrangler.toml

## 📁 ディレクトリ構造
```
RAIDHack/
├── README.md                    # プロジェクト全体の説明
├── AI_RULES.md                  # このファイル
├── api/                         # バックエンドAPI
│   ├── src/
│   │   ├── index.ts            # メインエントリーポイント
│   │   ├── types.ts            # 型定義（すべての型をここに集約）
│   │   ├── middleware/
│   │   │   └── auth.ts         # 認証ミドルウェア
│   │   └── routes/
│   │       ├── auth.ts         # 認証関連API
│   │       ├── ideas.ts        # アイデア関連API
│   │       ├── teams.ts        # チーム関連API（今後実装）
│   │       ├── applications.ts # 応募関連API（今後実装）
│   │       ├── works.ts        # 成果物関連API（今後実装）
│   │       └── votes.ts        # 投票関連API（今後実装）
│   ├── database/
│   │   ├── schema.sql          # データベーススキーマ
│   │   ├── seed.sql            # サンプルデータ
│   │   └── README.md           # DB設定ガイド
│   ├── package.json
│   ├── wrangler.toml
│   └── tsconfig.json
└── frontend/                    # フロントエンド（今後実装）
    ├── src/
    ├── package.json
    └── vite.config.ts
```

## 🔧 コーディングルール

### TypeScript
```typescript
// ❌ 悪い例
export interface User {
  id: any;
  name: string;
  email?: string | null;
}

// ✅ 良い例
export interface User {
  id: number;
  email: string;
  username: string;
  bio?: string;              // undefined推奨、nullは避ける
  skills: string[];
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

### API設計
```typescript
// ✅ 統一されたレスポンス形式
export interface ApiResponse {
  success: boolean;
  message: string;
  // データ部分は各APIに応じて拡張
}

export interface ErrorResponse extends ApiResponse {
  success: false;
  error: string;
}

export interface AuthResponse extends ApiResponse {
  success: true;
  user?: User;
  token?: string;
}
```

### データベース命名規則
```sql
-- ✅ 統一された命名
-- テーブル: 複数形、スネークケース
CREATE TABLE users (...);
CREATE TABLE team_members (...);

-- カラム: スネークケース
user_id, created_at, avatar_url

-- インデックス: idx_テーブル名_カラム名
CREATE INDEX idx_ideas_user_id ON ideas(user_id);
```

## 🎨 UI/UXガイドライン

### デザイン原則
1. **Google的シンプルさ**: 余計な装飾は避け、機能を際立たせる
2. **直感的操作**: 説明なしでも操作できるUI
3. **レスポンシブ対応**: モバイルファーストデザイン
4. **アクセシビリティ**: WCAG 2.1 AA準拠

### カラーパレット（予定）
```css
:root {
  --primary: #2563eb;      /* ブルー系 */
  --secondary: #64748b;    /* グレー系 */
  --success: #059669;      /* グリーン系 */
  --warning: #d97706;      /* オレンジ系 */
  --error: #dc2626;        /* レッド系 */
  --background: #ffffff;
  --surface: #f8fafc;
}
```

## 📝 開発フロー

### 1. 機能実装の順序
```
✅ 完了: 認証システム + アイデア投稿・いいね機能
🔄 次回: チーム機能 + 応募システム
⏳ 今後: 成果物投稿 + 投票機能
⏳ 最後: 通知システム + ファイルアップロード
```

### 2. ドキュメント管理ルール
- **README.mdはルートディレクトリのみ**: プロジェクト全体の概要・実行方法
- **詳細ガイドは個別ファイル**: AI_RULES.md、LOCAL_SETUP.md等
- **APIディレクトリのREADME**: API仕様のみ記載
- **コード変更時は必ずドキュメント更新**: 一貫性を保つ

### 3. コミットメッセージ
```
feat: アイデア投稿API実装
fix: 認証ミドルウェアの型エラー修正
docs: API仕様書更新
refactor: レスポンス型定義の統一
```

## 🚀 今後の実装予定

### Phase 2: チーム・応募機能
```typescript
// routes/teams.ts
POST /teams              // チーム作成
GET /teams/:id           // チーム詳細
POST /teams/:id/join     // チーム参加申請

// routes/applications.ts
POST /ideas/:id/apply    // アイデアに応募
GET /applications/me     // 自分の応募状況
PUT /applications/:id    // 応募承認/拒否
```

### Phase 3: 成果物・投票機能
```typescript
// routes/works.ts
POST /works              // 成果物投稿
GET /works               // 成果物一覧
GET /works/:id           // 成果物詳細

// routes/votes.ts
POST /works/:id/vote     // 成果物に投票
GET /votes/ranking       // 投票ランキング
```

## 💡 AI開発時の注意点

### 1. 型安全性最優先
- `any`型は絶対に使用しない
- すべての型を`types.ts`に集約
- データベースの戻り値は必ず型アサーション

### 2. エラーハンドリング
- 統一されたエラーレスポンス形式
- 日本語のユーザー向けメッセージ
- 開発者向けの詳細エラー情報

### 3. セキュリティ
- JWT秘密鍵は環境変数で管理
- SQLインジェクション対策（Prepared Statement）
- 適切な認証チェック

### 4. パフォーマンス
- 必要な情報のみをクエリ
- 適切なインデックス設計
- ページネーション実装

## 🔍 テスト・デバッグ

### ローカル開発
```bash
# API開発
cd api
npm run dev
# → http://localhost:8787

# データベース管理
wrangler d1 info raidhack-db
wrangler d1 execute raidhack-db --command="SELECT * FROM users"
```

### デプロイ
```bash
# 開発環境
npm run deploy:dev

# 本番環境
npm run deploy:prod
```

---

## 📌 重要事項

このルールプロンプトは、**RAIDHack開発チーム全体の統一性**を保つためのものです。新しい機能実装時は必ずこのガイドラインに従い、**Googleのようなシンプルで使いやすいプラットフォーム**という本来の目的を見失わないようにしてください。

### 疑問・提案がある場合
- 技術的な判断はこのガイドラインを基準とする
- 新しい提案は既存の設計思想との整合性を確認
- 常にユーザー体験（UX）を最優先に考慮
