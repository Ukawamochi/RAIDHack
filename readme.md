# 🎯 RAIDHack - Complete Hackathon Platform

![RAIDHack Logo](https://img.shields.io/badge/RAIDHack-Hackathon%20Platform-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-green?styl## 🎮 使い方ガイド

### 🚀 ハッカソン参加者として

1. **アカウント登録**
   - `/register` でアカウント作成
   - スキルと経歴を設定

2. **アイデア探索**
   - `/top` で最新アイデアをチェック
   - `/ideas/:id` で詳細確認・応募

3. **チーム結成**
   - 応募が承認されると自動でチーム作成
   - `/teams` でチーム管理・**Discord設定** ✅

4. **開発・提出**
   - `/works/submit` で作品提出
   - デモURL・リポジトリ・技術スタックを登録

5. **投票参加**
   - `/works` で他チームの作品に投票
   - 結果をリアルタイムで確認

### 👑 管理者として

1. **統計監視**
   - `/admin` でプラットフォーム全体を監視
   - ユーザー数・チーム数・投票数を確認

2. **コンテンツ管理**
   - アイデアのステータス管理
   - 不適切なコンテンツの対応

3. **参加者サポート**
   - システム通知で重要な情報を配信
   - ユーザーサポート対応

## 🛠️ 開発・カスタマイズ

### ローカル開発
```bash
# API開発
cd api
npm run dev        # 開発サーバー
npm run type-check # 型チェック
npm run build      # ビルド

# フロントエンド開発
cd web
npm run dev        # 開発サーバー
npm run build      # ビルド
npm run preview    # ビルド結果確認
```

### データベース操作
```bash
cd api

# スキーマ適用
wrangler d1 execute raidhack-db --file=database/schema-updated.sql

# 通知テーブル追加
wrangler d1 execute raidhack-db --file=database/add-notifications.sql

# データクエリ
wrangler d1 execute raidhack-db --command="SELECT * FROM users LIMIT 5"
```

### デプロイ
```bash
# 本番デプロイ
cd api && npm run deploy  # API
cd web && npm run build && npm run deploy  # Web

# 自動デプロイ（GitHub Actions）
git push origin main  # mainブランチへのpushで自動実行
```

## 🔐 セキュリティ機能

- **JWT認証** - 7日間有効なセキュアトークン
- **SQLインジェクション対策** - プリペアドステートメント使用
- **XSS対策** - React組み込み防御機能
- **CORS設定** - 適切なオリジン制限
- **環境変数管理** - 秘密情報の安全な管理

## 📈 パフォーマンス

- **Cloudflare Workers** - 世界200+拠点でエッジ実行
- **D1データベース** - SQLiteベースの高速クエリ
- **React 19** - 最新の仮想DOM最適化
- **Vite** - 高速な開発・ビルドツール
- **インデックス最適化** - データベースクエリ最適化

## 🐛 トラブルシューティング

### よくある問題と解決策

#### ❌ Database binding not found
```bash
# 解決: wrangler.tomlのdatabase_id設定確認
wrangler d1 create raidhack-db
# 出力されたIDをwrangler.tomlに設定
```

#### ❌ JWT secret not found
```bash
# 解決: 環境変数設定
wrangler secret put JWT_SECRET --env development
```

#### ❌ TypeScript compilation failed
```bash
# 解決: 型エラー確認・修正
cd api && npm run type-check
```

#### ❌ ログインできない
- **デモアカウント**: `raid@example.com` / `password` ✅
- API_BASE環境変数確認
- ネットワーク接続確認

## 🤝 貢献・開発参加

### 開発ルール
1. **型安全性重視** - `any`型使用禁止
2. **統一レスポンス** - API `success`・`message`必須
3. **セキュリティ優先** - JWT・環境変数適切管理
4. **シンプル設計** - Google風ミニマルデザイン

### 貢献手順
```bash
# 1. フォーク・クローン
git fork https://github.com/Ukawamochi/RAIDHack-api.git
git clone YOUR_FORK_URL

# 2. 機能ブランチ作成
git checkout -b feature/amazing-feature

# 3. 開発・テスト
cd api && npm run dev
cd web && npm run dev

# 4. プルリクエスト
git commit -m "feat: amazing feature"
git push origin feature/amazing-feature
```

## 📞 サポート

- **🐛 バグ報告**: [GitHub Issues](https://github.com/Ukawamochi/RAIDHack-api/issues)
- **💬 質問・議論**: [GitHub Discussions](https://github.com/Ukawamochi/RAIDHack-api/discussions)
- **📧 直接連絡**: [開発者Twitter](https://twitter.com/ukawamochi)

## 📄 ライセンス

MIT License - 商用利用・改変・再配布すべて自由

---

## 🏆 完成状況

**RAIDHackは、完全に機能するハッカソンプラットフォームです。**

✅ **すべての機能が実装完了**:
- ✅ **30+ API エンドポイント**
- ✅ **12 フロントエンドページ**
- ✅ **9 データベーステーブル**
- ✅ **Discord URL共有機能**
- ✅ **ログイン問題解決済み**
- ✅ **完全な型安全性**
- ✅ **本番レディ**

**今すぐ本格的なハッカソンイベントで使用可能！** 🚀

---

<div align="center">

**Made with ❤️ by the RAIDHack Team**

[🌟 Star us on GitHub](https://github.com/Ukawamochi/RAIDHack-api) | [🐛 Report Bug](https://github.com/Ukawamochi/RAIDHack-api/issues) | [💬 Join Discussion](https://github.com/Ukawamochi/RAIDHack-api/discussions)

</div>-badge)
![Tech Stack](https://img.shields.io/badge/Tech-React%20%7C%20Cloudflare%20Workers-orange?style=for-the-badge)

> **🚀 Google級のシンプルさで本格的なハッカソンプラットフォーム**
> 
> アイデア投稿 → チーム結成 → 開発 → 作品投票まで完全対応

## ✨ 主要機能

### � 認証・ユーザー管理
- JWT認証によるセキュアなログイン
- プロフィール管理（スキル・経歴設定）
- デモアカウント対応

### � アイデア管理
- アイデア投稿・詳細表示
- いいね機能とソーシャル要素
- 必要スキルによるマッチング

### � チーム結成システム
- アイデアへの応募システム
- 自動チーム作成機能
- **Discord招待URL共有** ✅
- チームメンバー管理

### 🏆 作品管理・投票
- 作品提出フォーム
- デモURL・リポジトリリンク
- リアルタイム投票システム
- 技術スタック表示

### 🔔 通知システム
- 応募・承認・拒否通知
- 新着アイデア通知
- 投票・チーム結成通知
- 未読管理とベル表示

### 👑 管理者機能
- 統計ダッシュボード
- ユーザー・チーム・アイデア管理
- システム通知送信
- パフォーマンス分析

## 🚀 クイックスタート

### 📋 前提条件
- **Node.js 18+** (推奨: 20.x LTS)
- **Cloudflareアカウント**（無料でOK）
- **Git**

### ⚡ 1分セットアップ

```bash
# 1. プロジェクトクローン
git clone https://github.com/Ukawamochi/RAIDHack-api.git
cd RAIDHack

# 2. Wrangler設定
npm install -g wrangler
wrangler login

# 3. データベース作成
cd api
wrangler d1 create raidhack-db
# ↑ 出力されたdatabase_idをwrangler.tomlに設定

# 4. データベース初期化
wrangler d1 execute raidhack-db --file=database/schema-updated.sql
wrangler d1 execute raidhack-db --file=database/add-notifications.sql

# 5. 環境変数設定
wrangler secret put JWT_SECRET --env development
# ↑ 任意の秘密鍵を入力（32文字以上推奨）

# 6. 開発サーバー起動
npm install
npm run dev  # APIサーバー起動

# 7. フロントエンド起動（別ターミナル）
cd ../web
npm install
npm run dev  # Webサーバー起動
```

### 🎮 動作確認

1. **Web**: http://localhost:5173 にアクセス
2. **API**: http://localhost:8787/health でヘルスチェック
3. **ログイン**: `raid@example.com` / `password` でテスト

## 🏗️ 技術スタック

### フロントエンド
- **React 19** + **TypeScript**
- **Vite** - 高速ビルドツール
- **React Router** - SPA ルーティング
- **Tailwind CSS風** スタイリング
- **Lucide React** - アイコンライブラリ
- **date-fns** - 日時処理

### バックエンド
- **Cloudflare Workers** - サーバーレス実行環境
- **Hono v4** - 軽量Webフレームワーク
- **Cloudflare D1** - SQLiteデータベース
- **JWT認証** - セキュアなトークン認証
- **TypeScript** - 型安全な開発

### インフラ・デプロイ
- **Cloudflare Pages** - フロントエンド配信
- **Cloudflare Workers** - API実行環境
- **GitHub Actions** - CI/CD自動化
- **D1データベース** - スケーラブルなストレージ

## 📊 システム構成

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Server     │    │   Database      │
│   (React)       │◄──►│ (Hono Workers)   │◄──►│ (Cloudflare D1) │
│   Port: 5173    │    │   Port: 8787     │    │   SQLite        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### データベース設計
- **9テーブル** 正規化されたスキーマ
- **10インデックス** パフォーマンス最適化
- **外部キー制約** データ整合性保証

## 🎯 実装完了機能

| 機能カテゴリー | 実装状況 | 詳細 |
|---------------|---------|------|
| 🔐 **認証システム** | ✅ 100% | JWT認証、プロフィール管理、セッション管理 |
| 💡 **アイデア管理** | ✅ 100% | 投稿、詳細表示、いいね、ステータス管理 |
| � **チーム結成** | ✅ 100% | 応募、承認、自動チーム作成、Discord連携 |
| 🏆 **作品システム** | ✅ 100% | 提出、一覧、投票、技術スタック表示 |
| 🔔 **通知システム** | ✅ 100% | リアルタイム通知、未読管理、種類別通知 |
| � **管理者機能** | ✅ 100% | 統計、ユーザー管理、システム通知 |
| 🌐 **本番対応** | ✅ 100% | Cloudflare デプロイ、CI/CD、スケーリング |

## 📱 主要ページ一覧

### 一般ユーザー向け（12ページ）
- `/` - ホームページ（プラットフォーム紹介）
- `/login` / `/register` - 認証ページ
- `/top` - ダッシュボード（概要・最新情報）
- `/create` - アイデア投稿
- `/ideas/:id` - アイデア詳細・応募
- `/applications` - 応募履歴
- `/teams` - チーム一覧・管理
- `/works` - 作品一覧・投票
- `/works/submit` - 作品提出
- `/notifications` - 通知一覧
- `/profile` - プロフィール管理

### 管理者向け（1ページ）
- `/admin` - 管理者ダッシュボード

## � API仕様

### 認証 (3エンドポイント)
```bash
POST /api/auth/register    # ユーザー登録
POST /api/auth/login       # ログイン
GET  /api/auth/me          # プロフィール取得
```

### アイデア (5エンドポイント)
```bash
GET  /api/ideas            # アイデア一覧
GET  /api/ideas/:id        # アイデア詳細
POST /api/ideas            # アイデア投稿
POST /api/ideas/:id/like   # いいね切り替え
GET  /api/ideas/:id/applications  # 応募一覧
```

### 応募 (4エンドポイント)
```bash
GET  /api/applications/me           # 応募履歴
POST /api/ideas/:id/apply           # 応募
PUT  /api/ideas/:id/applications/:id # 応募承認・拒否
POST /api/applications/:id/create-team # チーム作成
```

### チーム (4エンドポイント)
```bash
GET  /api/teams/me         # 参加チーム一覧
GET  /api/teams/:id        # チーム詳細
PUT  /api/teams/:id/discord # Discord URL設定 ✅
DELETE /api/teams/:id      # チーム解散
```

### 作品 (4エンドポイント)
```bash
GET  /api/works            # 作品一覧
POST /api/works            # 作品提出
POST /api/works/:id/vote   # 投票
GET  /api/works/me         # 自分の作品
```

### 通知 (5エンドポイント)
```bash
GET  /api/notifications           # 通知一覧
GET  /api/notifications/unread-count # 未読数
PUT  /api/notifications/:id/read  # 既読
PUT  /api/notifications/mark-all-read # 一括既読
DELETE /api/notifications/:id     # 削除
```

### 管理者 (6エンドポイント)
```bash
GET  /api/admin/stats      # 統計情報
GET  /api/admin/users      # ユーザー管理
GET  /api/admin/ideas      # アイデア管理
GET  /api/admin/teams      # チーム管理
PUT  /api/admin/ideas/:id/status # ステータス更新
POST /api/admin/notifications/system # システム通知
```

## � サポート・お問い合わせ

- **� バグ報告**: [GitHub Issues](https://github.com/Ukawamochi/RAIDHack-api/issues)
- **💬 質問・議論**: [GitHub Discussions](https://github.com/Ukawamochi/RAIDHack-api/discussions)  
- **� 詳細ガイド**: [LOCAL_SETUP.md](./LOCAL_SETUP.md)

---

**注意**: `/web`ディレクトリは旧フロントエンド環境です。現在はAPIのみに集中して開発中のため、`npm run dev`は`/api`ディレクトリで実行してください。


