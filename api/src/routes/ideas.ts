import { Hono } from "hono";
import { 
  AppContext, 
  Idea, 
  IdeasResponse,
  IdeaResponse,
  ErrorResponse,
  CreateIdeaRequest,
  User 
} from "../types";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth";

export const ideaRoutes = new Hono<AppContext>();

// アイデア一覧取得（ページネーション付き）
ideaRoutes.get('/', optionalAuthMiddleware, async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const offset = (page - 1) * limit;
    const userId = c.get('userId') as number | undefined;

    // 合計アイデア数を取得
    const countResult = await c.env.DB.prepare(
      "SELECT COUNT(*) as total FROM ideas WHERE status = 'open'"
    ).first();
    const total = (countResult?.total as number) || 0;

    // アイデア一覧を取得（いいね情報も含む）
    const ideas = await c.env.DB.prepare(`
      SELECT 
        i.id, i.title, i.description, i.required_skills, i.status, 
        i.created_at, i.updated_at, i.user_id,
        u.username, u.avatar_url,
        COUNT(il.id) as like_count,
        ${userId ? `CASE WHEN il_user.user_id IS NOT NULL THEN 1 ELSE 0 END as user_liked` : '0 as user_liked'}
      FROM ideas i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN idea_likes il ON i.id = il.idea_id
      ${userId ? 'LEFT JOIN idea_likes il_user ON i.id = il_user.idea_id AND il_user.user_id = ?' : ''}
      WHERE i.status = 'open'
      GROUP BY i.id, i.title, i.description, i.required_skills, i.status, 
               i.created_at, i.updated_at, i.user_id, u.username, u.avatar_url
      ORDER BY i.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(...(userId ? [userId, limit, offset] : [limit, offset])).all();

    const ideaList: Idea[] = ideas.results.map((idea: any) => ({
      id: idea.id as number,
      title: idea.title as string,
      description: idea.description as string,
      requiredSkills: idea.required_skills ? JSON.parse(idea.required_skills as string) : [],
      status: idea.status as 'open' | 'development' | 'completed',
      createdAt: idea.created_at as string,
      updatedAt: idea.updated_at as string,
      user: {
        id: idea.user_id as number,
        username: idea.username as string,
        avatarUrl: idea.avatar_url || undefined
      },
      likeCount: idea.like_count as number,
      userLiked: userId ? Boolean(idea.user_liked) : false
    }));

    const response: IdeasResponse = {
      success: true,
      message: "アイデア一覧を取得しました",
      ideas: ideaList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };

    return c.json(response);

  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "アイデア一覧の取得中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// アイデア詳細取得
ideaRoutes.get('/:id', optionalAuthMiddleware, async (c) => {
  try {
    const ideaId = parseInt(c.req.param('id'));
    const userId = c.get('userId') as number | undefined;

    if (isNaN(ideaId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "無効なアイデアIDです",
        error: "Invalid idea ID"
      };
      return c.json(errorResponse, 400);
    }

    // アイデア詳細を取得
    const ideaData = await c.env.DB.prepare(`
      SELECT 
        i.id, i.title, i.description, i.required_skills, i.status, 
        i.created_at, i.updated_at, i.user_id,
        u.username, u.email, u.bio, u.skills, u.avatar_url,
        COUNT(il.id) as like_count,
        ${userId ? `CASE WHEN il_user.user_id IS NOT NULL THEN 1 ELSE 0 END as user_liked` : '0 as user_liked'}
      FROM ideas i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN idea_likes il ON i.id = il.idea_id
      ${userId ? 'LEFT JOIN idea_likes il_user ON i.id = il_user.idea_id AND il_user.user_id = ?' : ''}
      WHERE i.id = ?
      GROUP BY i.id, i.title, i.description, i.required_skills, i.status, 
               i.created_at, i.updated_at, i.user_id, u.username, u.email, 
               u.bio, u.skills, u.avatar_url
    `).bind(...(userId ? [userId, ideaId] : [ideaId])).first();

    if (!ideaData) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "アイデアが見つかりません",
        error: "Idea not found"
      };
      return c.json(errorResponse, 404);
    }

    const idea: Idea = {
      id: ideaData.id as number,
      title: ideaData.title as string,
      description: ideaData.description as string,
      requiredSkills: ideaData.required_skills ? JSON.parse(ideaData.required_skills as string) : [],
      status: ideaData.status as 'open' | 'development' | 'completed',
      createdAt: ideaData.created_at as string,
      updatedAt: ideaData.updated_at as string,
      user: {
        id: ideaData.user_id as number,
        email: ideaData.email as string,
        username: ideaData.username as string,
        bio: ideaData.bio || undefined,
        skills: ideaData.skills ? JSON.parse(ideaData.skills as string) : [],
        avatarUrl: ideaData.avatar_url || undefined
      },
      likeCount: ideaData.like_count as number,
      userLiked: userId ? Boolean(ideaData.user_liked) : false
    };

    const response: IdeaResponse = {
      success: true,
      message: "アイデア詳細を取得しました",
      idea
    };

    return c.json(response);

  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "アイデア詳細の取得中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// アイデア投稿（認証必須）
ideaRoutes.post('/', authMiddleware, async (c) => {
  try {
    const body = await c.req.json() as CreateIdeaRequest;
    const { title, description, requiredSkills } = body;
    const user = c.get('user') as User;

    // バリデーション
    if (!title || !description) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "タイトルと説明は必須です",
        error: "Missing required fields"
      };
      return c.json(errorResponse, 400);
    }

    // アイデア作成
    const skillsJson = requiredSkills ? JSON.stringify(requiredSkills) : null;
    const result = await c.env.DB.prepare(
      `INSERT INTO ideas (title, description, required_skills, user_id, status) 
       VALUES (?, ?, ?, ?, 'open') RETURNING id, created_at, updated_at`
    ).bind(title, description, skillsJson, user.id).first();

    if (!result) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "アイデアの作成に失敗しました",
        error: "Failed to create idea"
      };
      return c.json(errorResponse, 500);
    }

    const idea: Idea = {
      id: result.id as number,
      title,
      description,
      requiredSkills: requiredSkills || [],
      status: 'open' as const,
      createdAt: result.created_at as string,
      updatedAt: result.updated_at as string,
      user: {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl
      },
      likeCount: 0,
      userLiked: false
    };

    const response: IdeaResponse = {
      success: true,
      message: "アイデアが正常に投稿されました",
      idea
    };

    return c.json(response, 201);

  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "アイデア投稿中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// アイデアにいいね/いいね解除（認証必須）
ideaRoutes.post('/:id/like', authMiddleware, async (c) => {
  try {
    const ideaId = parseInt(c.req.param('id'));
    const userId = c.get('userId') as number;

    if (isNaN(ideaId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "無効なアイデアIDです",
        error: "Invalid idea ID"
      };
      return c.json(errorResponse, 400);
    }

    // アイデアの存在確認
    const idea = await c.env.DB.prepare(
      "SELECT id FROM ideas WHERE id = ?"
    ).bind(ideaId).first();

    if (!idea) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "アイデアが見つかりません",
        error: "Idea not found"
      };
      return c.json(errorResponse, 404);
    }

    // 既存のいいねを確認
    const existingLike = await c.env.DB.prepare(
      "SELECT id FROM idea_likes WHERE idea_id = ? AND user_id = ?"
    ).bind(ideaId, userId).first();

    if (existingLike) {
      // いいね解除
      await c.env.DB.prepare(
        "DELETE FROM idea_likes WHERE idea_id = ? AND user_id = ?"
      ).bind(ideaId, userId).run();

      return c.json({
        success: true,
        message: "いいねを解除しました",
        liked: false
      });
    } else {
      // いいね追加
      await c.env.DB.prepare(
        "INSERT INTO idea_likes (idea_id, user_id) VALUES (?, ?)"
      ).bind(ideaId, userId).run();

      return c.json({
        success: true,
        message: "いいねしました",
        liked: true
      });
    }

  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "いいね処理中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});
