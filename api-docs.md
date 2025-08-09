# RAIDHack API Documentation

## 概要

RAIDHack APIは、ハッカソンプラットフォームのバックエンドサービスです。Hono + Cloudflare Workersで構築され、アイデア投稿、チーム形成、作品投稿、投票などの機能を提供します。

**Base URL**: `https://raidhack-api.ukawamochi5.workers.dev`

## 認証

### JWT認証
多くのエンドポイントでJWT（JSON Web Token）認証が必要です。

**Authorizationヘッダー**:
```
Authorization: Bearer <JWT_TOKEN>
```

## 共通レスポンス形式

### 成功レスポンス
```json
{
  "success": true,
  "message": "処理が正常に完了しました",
  "data": {...}
}
```

### エラーレスポンス
```json
{
  "success": false,
  "message": "エラーメッセージ",
  "error": "詳細なエラー情報"
}
```

## エンドポイント一覧

### ヘルスチェック

#### GET /health
サーバーの稼働状況を確認

**レスポンス**:
```json
{
  "status": "ok",
  "timestamp": "2025-01-09T06:08:31.000Z",
  "service": "RAIDHack API"
}
```

---

## 認証 (Authentication)

### POST /api/auth/register
新しいユーザーを登録

**リクエストボディ**:
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password",
  "bio": "自己紹介文（任意）",
  "skills": ["JavaScript", "React"]
}
```

**レスポンス**:
```json
{
  "success": true,
  "message": "ユーザーが正常に作成されました",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "bio": "自己紹介文",
    "skills": ["JavaScript", "React"],
    "avatarUrl": null,
    "createdAt": "2025-01-09T06:08:31.000Z",
    "updatedAt": "2025-01-09T06:08:31.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /api/auth/login
ユーザーログイン

**リクエストボディ**:
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**レスポンス**: 登録と同様のユーザー情報とトークン

### GET /api/auth/me
現在のユーザー情報を取得（認証必須）

**レスポンス**:
```json
{
  "success": true,
  "message": "ユーザー情報を取得しました",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "bio": "自己紹介文",
    "skills": ["JavaScript", "React"],
    "avatarUrl": null,
    "createdAt": "2025-01-09T06:08:31.000Z",
    "updatedAt": "2025-01-09T06:08:31.000Z"
  }
}
```

### PUT /api/auth/profile
プロフィール更新（認証必須）

**リクエストボディ**:
```json
{
  "username": "new_username",
  "bio": "新しい自己紹介",
  "skills": ["JavaScript", "React", "Node.js"]
}
```

---

## アイデア管理 (Ideas)

### GET /api/ideas
アイデア一覧取得（ページネーション付き）

**クエリパラメータ**:
- `page`: ページ番号（デフォルト: 1）
- `limit`: 1ページあたりの件数（デフォルト: 10）

**レスポンス**:
```json
{
  "success": true,
  "message": "アイデア一覧を取得しました",
  "ideas": [
    {
      "id": 1,
      "title": "革新的なWebアプリ",
      "description": "新しいWebアプリケーションのアイデア",
      "requiredSkills": ["JavaScript", "React"],
      "status": "open",
      "createdAt": "2025-01-09T06:08:31.000Z",
      "updatedAt": "2025-01-09T06:08:31.000Z",
      "user": {
        "id": 1,
        "username": "creator",
        "avatarUrl": null
      },
      "likeCount": 5,
      "userLiked": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### GET /api/ideas/:id
アイデア詳細取得

**レスポンス**:
```json
{
  "success": true,
  "message": "アイデア詳細を取得しました",
  "idea": {
    "id": 1,
    "title": "革新的なWebアプリ",
    "description": "詳細な説明...",
    "requiredSkills": ["JavaScript", "React"],
    "status": "open",
    "createdAt": "2025-01-09T06:08:31.000Z",
    "updatedAt": "2025-01-09T06:08:31.000Z",
    "user": {
      "id": 1,
      "email": "creator@example.com",
      "username": "creator",
      "bio": "クリエーターです",
      "skills": ["JavaScript", "React"],
      "avatarUrl": null
    },
    "likeCount": 5,
    "userLiked": false
  }
}
```

### POST /api/ideas
アイデア投稿（認証必須）

**リクエストボディ**:
```json
{
  "title": "新しいアイデア",
  "description": "アイデアの詳細説明",
  "requiredSkills": ["JavaScript", "Python"]
}
```

### POST /api/ideas/:id/like
アイデアにいいね/いいね解除（認証必須）

**レスポンス**:
```json
{
  "success": true,
  "message": "いいねしました",
  "liked": true
}
```

### POST /api/ideas/:id/apply
アイデアに応募（認証必須）

**リクエストボディ**:
```json
{
  "message": "応募メッセージ",
  "motivation": "志望動機"
}
```

### GET /api/ideas/:id/applications
アイデアの応募一覧取得（アイデア作成者のみ、認証必須）

**レスポンス**:
```json
{
  "success": true,
  "applications": [
    {
      "id": 1,
      "message": "応募メッセージ",
      "status": "pending",
      "created_at": "2025-01-09T06:08:31.000Z",
      "applicant": {
        "id": 2,
        "username": "applicant",
        "email": "applicant@example.com",
        "bio": "応募者です",
        "skills": ["JavaScript"],
        "avatar_url": null
      }
    }
  ]
}
```

### PUT /api/ideas/:id/applications/:applicationId
応募の承認/拒否（アイデア作成者のみ、認証必須）

**リクエストボディ**:
```json
{
  "action": "approve", // "approve" or "reject"
  "message": "審査メッセージ"
}
```

---

## 応募管理 (Applications)

### GET /api/applications/me
自分の応募一覧取得（認証必須）

**レスポンス**:
```json
{
  "success": true,
  "applications": [
    {
      "id": 1,
      "idea_id": 1,
      "message": "応募メッセージ",
      "status": "approved",
      "applied_at": "2025-01-09T06:08:31.000Z",
      "idea": {
        "title": "アイデアタイトル",
        "description": "アイデア説明",
        "username": "作成者"
      }
    }
  ]
}
```

### POST /api/applications/:id/create-team
承認された応募からチーム作成（認証必須）

**レスポンス**:
```json
{
  "success": true,
  "message": "チームが作成されました",
  "team": {
    "id": 1,
    "idea_id": 1,
    "name": "アイデアタイトル チーム",
    "status": "active"
  }
}
```

---

## チーム管理 (Teams)

### GET /api/teams/me
自分が参加しているチーム一覧（認証必須）

**レスポンス**:
```json
{
  "success": true,
  "teams": [
    {
      "id": 1,
      "idea_id": 1,
      "name": "チーム名",
      "description": "チーム説明",
      "status": "active",
      "discord_url": "https://discord.gg/invite",
      "created_at": "2025-01-09T06:08:31.000Z",
      "idea": {
        "id": 1,
        "title": "アイデアタイトル",
        "description": "アイデア説明"
      }
    }
  ]
}
```

### GET /api/teams/:id
チーム詳細取得（チームメンバーのみ、認証必須）

**レスポンス**:
```json
{
  "success": true,
  "team": {
    "id": 1,
    "idea_id": 1,
    "name": "チーム名",
    "description": "チーム説明",
    "status": "active",
    "discord_invite_url": "https://discord.gg/invite",
    "created_at": "2025-01-09T06:08:31.000Z",
    "updated_at": "2025-01-09T06:08:31.000Z",
    "members": [
      {
        "id": 1,
        "team_id": 1,
        "user_id": 1,
        "role": "leader",
        "joined_at": "2025-01-09T06:08:31.000Z",
        "username": "leader",
        "email": "leader@example.com",
        "bio": "チームリーダー",
        "skills": ["JavaScript", "React"],
        "avatar_url": null
      }
    ],
    "idea": {
      "id": 1,
      "title": "アイデアタイトル",
      "description": "アイデア説明",
      "required_skills": ["JavaScript", "React"]
    }
  }
}
```

### PUT /api/teams/:id/discord
Discord招待URL設定（チームリーダーのみ、認証必須）

**リクエストボディ**:
```json
{
  "discord_url": "https://discord.gg/new-invite"
}
```

### DELETE /api/teams/:id
チーム解散（チームリーダーのみ、認証必須）

**レスポンス**:
```json
{
  "success": true,
  "message": "チームを解散しました"
}
```

---

## 作品管理 (Works)

### GET /api/works
作品一覧取得（ページネーション付き）

**クエリパラメータ**:
- `page`: ページ番号（デフォルト: 1）
- `limit`: 1ページあたりの件数（デフォルト: 10）

**レスポンス**:
```json
{
  "success": true,
  "message": "作品一覧を取得しました",
  "works": [
    {
      "id": 1,
      "title": "素晴らしい作品",
      "description": "作品の説明",
      "technologies": ["React", "Node.js"],
      "imageUrl": "https://example.com/image.jpg",
      "liveUrl": "https://example.com/demo",
      "githubUrl": "https://github.com/user/repo",
      "createdAt": "2025-01-09T06:08:31.000Z",
      "updatedAt": "2025-01-09T06:08:31.000Z",
      "ideaId": 1,
      "ideaTitle": "元となったアイデア",
      "teamMembers": [
        {
          "id": 1,
          "username": "member1",
          "avatarUrl": null
        }
      ],
      "voteCount": 10,
      "userVoted": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

### GET /api/works/:id
作品詳細取得

**レスポンス**: 作品一覧と同様の構造だが、チームメンバーにより詳細な情報を含む

### POST /api/works
作品投稿（認証必須）

**リクエストボディ**:
```json
{
  "title": "作品タイトル",
  "description": "作品の詳細説明",
  "technologies": ["React", "Node.js", "MongoDB"],
  "imageUrl": "https://example.com/screenshot.jpg",
  "liveUrl": "https://example.com/demo",
  "githubUrl": "https://github.com/user/repo",
  "ideaId": 1,
  "teamMemberIds": [2, 3]
}
```

### POST /api/works/:id/vote
作品に投票/投票解除（認証必須）

**レスポンス**:
```json
{
  "success": true,
  "message": "投票しました",
  "voted": true
}
```

---

## 通知管理 (Notifications)

### GET /api/notifications
通知一覧取得（認証必須）

**レスポンス**:
```json
{
  "success": true,
  "notifications": [
    {
      "id": 1,
      "type": "application_status",
      "title": "応募が承認されました",
      "message": "あなたの応募が承認されました",
      "data": {
        "ideaId": 1,
        "teamId": 1
      },
      "is_read": false,
      "created_at": "2025-01-09T06:08:31.000Z"
    }
  ]
}
```

### GET /api/notifications/unread-count
未読通知数取得（認証必須）

**レスポンス**:
```json
{
  "success": true,
  "count": 3
}
```

### PUT /api/notifications/:id/read
通知を既読にする（認証必須）

### PUT /api/notifications/mark-all-read
全ての通知を既読にする（認証必須）

### DELETE /api/notifications/:id
通知削除（認証必須）

---

## 管理者機能 (Admin)

**注意**: 以下のエンドポイントは管理者権限が必要です。

### GET /api/admin/stats
システム全体の統計情報取得

**レスポンス**:
```json
{
  "stats": {
    "users": 100,
    "ideas": 50,
    "teams": 25,
    "works": 15,
    "applications": 80,
    "votes": 200
  },
  "recentActivity": {
    "ideas": [...],
    "applications": [...],
    "works": [...]
  },
  "statusStats": {
    "ideas": [
      {"status": "open", "count": 30},
      {"status": "development", "count": 15},
      {"status": "completed", "count": 5}
    ],
    "applications": [...],
    "teams": [...]
  }
}
```

### GET /api/admin/users
全ユーザー一覧取得

### GET /api/admin/ideas
全アイデア管理（ステータスフィルタ対応）

### PUT /api/admin/ideas/:id/status
アイデアのステータス更新

### GET /api/admin/teams
全チーム管理

### POST /api/admin/notifications/system
システム通知送信

**リクエストボディ**:
```json
{
  "title": "システムメンテナンスのお知らせ",
  "message": "明日の午前2時からメンテナンスを実施します",
  "target_type": "all", // "all" or "specific"
  "target_ids": [1, 2, 3] // target_type が "specific" の場合
}
```

---

## エラーコード

| HTTPステータス | 説明 |
|---|---|
| 200 | 成功 |
| 201 | 作成成功 |
| 400 | リクエストエラー（バリデーション失敗など） |
| 401 | 認証エラー |
| 403 | 権限エラー |
| 404 | リソースが見つからない |
| 409 | 競合エラー（重複データなど） |
| 500 | サーバーエラー |

---

## データモデル

### User（ユーザー）
```typescript
interface User {
  id: number;
  email: string;
  username: string;
  bio?: string;
  skills: string[];
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Idea（アイデア）
```typescript
interface Idea {
  id: number;
  title: string;
  description: string;
  requiredSkills: string[];
  userId: number;
  status: 'open' | 'development' | 'completed';
  createdAt: string;
  updatedAt: string;
}
```

### Application（応募）
```typescript
interface Application {
  id: number;
  ideaId: number;
  applicantId: number;
  message?: string;
  motivation?: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedAt?: string;
  reviewMessage?: string;
}
```

### Team（チーム）
```typescript
interface Team {
  id: number;
  ideaId: number;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'disbanded';
  discordInviteUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Work（作品）
```typescript
interface Work {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  createdAt: string;
  updatedAt: string;
  ideaId?: number;
}
```

---

## 使用例

### ユーザー登録からチーム作成まで

1. **ユーザー登録**
```bash
curl -X POST https://raidhack-api.ukawamochi5.workers.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "user",
    "password": "password",
    "skills": ["JavaScript", "React"]
  }'
```

2. **アイデア投稿**
```bash
curl -X POST https://raidhack-api.ukawamochi5.workers.dev/api/ideas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "新しいWebアプリ",
    "description": "革新的なアイデア",
    "requiredSkills": ["JavaScript", "React"]
  }'
```

3. **アイデアに応募**
```bash
curl -X POST https://raidhack-api.ukawamochi5.workers.dev/api/ideas/1/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "message": "ぜひ参加したいです！"
  }'
```

4. **応募を承認してチーム作成**
```bash
curl -X PUT https://raidhack-api.ukawamochi5.workers.dev/api/ideas/1/applications/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "action": "approve"
  }'
```

---

## CORS設定

以下のオリジンからのリクエストが許可されています：
- `http://localhost:5173` (開発環境)
- `http://localhost:3000` (開発環境)
- `https://raidhack-web.pages.dev` (本番環境)
- `https://*.raidhack-web.pages.dev` (PR環境)
- `https://*.pages.dev` (汎用Pagesドメイン)

---

## レート制限

現在、レート制限は実装されていませんが、将来的に追加される可能性があります。

---

## 更新履歴

- **v1.0.0** (2025-01-09): 初期リリース
  - 基本的なユーザー認証機能
  - アイデア投稿・応募機能
  - チーム管理機能
  - 作品投稿・投票機能
  - 通知システム
  - 管理者機能