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

    const ideaList: Idea[] = ideas.results.map((idea: any) => {
      let requiredSkills: string[] = [];
      try {
        requiredSkills = idea.required_skills ? JSON.parse(idea.required_skills as string) : [];
      } catch (error) {
        console.warn('Failed to parse required_skills JSON:', idea.required_skills, error);
        requiredSkills = [];
      }

      return {
        id: idea.id as number,
        title: idea.title as string,
        description: idea.description as string,
        required_skills: requiredSkills,
        user_id: idea.user_id as number,
        status: idea.status as 'open' | 'development' | 'completed',
        created_at: idea.created_at as string,
        updated_at: idea.updated_at as string,
        username: idea.username as string,
        avatar_url: idea.avatar_url || undefined,
        like_count: idea.like_count as number,
        user_liked: userId ? Boolean(idea.user_liked) : false
      };
    });

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
      required_skills: ideaData.required_skills ? JSON.parse(ideaData.required_skills as string) : [],
      user_id: ideaData.user_id as number,
      status: ideaData.status as 'open' | 'development' | 'completed',
      created_at: ideaData.created_at as string,
      updated_at: ideaData.updated_at as string,
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
    const { title, description, required_skills } = body;
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
    const skillsJson = required_skills ? JSON.stringify(required_skills) : null;
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
      required_skills: required_skills || [],
      user_id: user.id,
      status: 'open' as const,
      created_at: result.created_at as string,
      updated_at: result.updated_at as string
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

// アイデアへの応募
ideaRoutes.post('/:id/apply', authMiddleware, async (c) => {
  try {
    const ideaId = parseInt(c.req.param('id'));
    const userId = c.get('userId') as number;
    const { message, motivation } = await c.req.json();

    if (!ideaId || isNaN(ideaId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "無効なアイデアIDです",
        error: "Invalid idea ID"
      };
      return c.json(errorResponse, 400);
    }

    // アイデアの存在確認と詳細取得
    const idea = await c.env.DB.prepare(`
      SELECT id, title, user_id, status 
      FROM ideas 
      WHERE id = ?
    `).bind(ideaId).first();

    if (!idea) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "アイデアが見つかりません",
        error: "Idea not found"
      };
      return c.json(errorResponse, 404);
    }

    // 自分のアイデアには応募できない
    if (idea.user_id === userId) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "自分のアイデアには応募できません",
        error: "Cannot apply to own idea"
      };
      return c.json(errorResponse, 400);
    }

    // アイデアがオープン状態でない場合は応募できない
    if (idea.status !== 'open') {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "このアイデアは現在応募を受け付けていません",
        error: "Idea is not open for applications"
      };
      return c.json(errorResponse, 400);
    }

    // 既に応募済みかチェック
    const existingApplication = await c.env.DB.prepare(
      "SELECT id FROM applications WHERE idea_id = ? AND applicant_id = ?"
    ).bind(ideaId, userId).first();

    if (existingApplication) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "既にこのアイデアに応募済みです",
        error: "Already applied to this idea"
      };
      return c.json(errorResponse, 400);
    }

    // 応募を作成
    const applicationResult = await c.env.DB.prepare(`
      INSERT INTO applications (idea_id, applicant_id, message, motivation, status, applied_at)
      VALUES (?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
    `).bind(ideaId, userId, message || '', motivation || '').run();

    return c.json({
      success: true,
      message: "応募を送信しました",
      application: {
        id: applicationResult.meta.last_row_id,
        idea_id: ideaId,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Application error:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      message: "応募処理中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// アイデアの応募一覧取得（アイデア作成者のみ）
ideaRoutes.get('/:id/applications', authMiddleware, async (c) => {
  try {
    const ideaId = parseInt(c.req.param('id'));
    const userId = c.get('userId') as number;

    if (!ideaId || isNaN(ideaId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "無効なアイデアIDです",
        error: "Invalid idea ID"
      };
      return c.json(errorResponse, 400);
    }

    // アイデアの所有者確認
    const idea = await c.env.DB.prepare(
      "SELECT user_id FROM ideas WHERE id = ?"
    ).bind(ideaId).first();

    if (!idea) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "アイデアが見つかりません",
        error: "Idea not found"
      };
      return c.json(errorResponse, 404);
    }

    if (idea.user_id !== userId) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "このアイデアの応募一覧を表示する権限がありません",
        error: "Not authorized to view applications"
      };
      return c.json(errorResponse, 403);
    }

    // 応募一覧を取得
    const applications = await c.env.DB.prepare(`
      SELECT 
        a.id, a.message, a.status, a.applied_at,
        u.id as user_id, u.username, u.email, u.bio, u.skills, u.avatar_url
      FROM applications a
      JOIN users u ON a.applicant_id = u.id
      WHERE a.idea_id = ?
      ORDER BY a.applied_at DESC
    `).bind(ideaId).all();

    return c.json({
      success: true,
      applications: applications.results.map((app: any) => ({
        id: app.id,
        message: app.message,
        status: app.status,
        created_at: app.applied_at,
        applicant: {
          id: app.user_id,
          username: app.username,
          email: app.email,
          bio: app.bio,
          skills: app.skills ? JSON.parse(app.skills) : [],
          avatar_url: app.avatar_url
        }
      }))
    });

  } catch (error) {
    console.error('Get applications error:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      message: "応募一覧取得中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// 応募の承認/拒否
ideaRoutes.put('/:id/applications/:applicationId', authMiddleware, async (c) => {
  try {
    const ideaId = parseInt(c.req.param('id'));
    const applicationId = parseInt(c.req.param('applicationId'));
    const userId = c.get('userId') as number;
    const { action, message } = await c.req.json(); // action: 'approve' | 'reject'

    if (!ideaId || isNaN(ideaId) || !applicationId || isNaN(applicationId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "無効なIDです",
        error: "Invalid ID"
      };
      return c.json(errorResponse, 400);
    }

    if (!['approve', 'reject'].includes(action)) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "無効なアクションです",
        error: "Invalid action"
      };
      return c.json(errorResponse, 400);
    }

    // アイデアの所有者確認
    const idea = await c.env.DB.prepare(
      "SELECT user_id FROM ideas WHERE id = ?"
    ).bind(ideaId).first();

    if (!idea) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "アイデアが見つかりません",
        error: "Idea not found"
      };
      return c.json(errorResponse, 404);
    }

    if (idea.user_id !== userId) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "この応募を審査する権限がありません",
        error: "Not authorized to review application"
      };
      return c.json(errorResponse, 403);
    }

    // 応募の存在確認
    const application = await c.env.DB.prepare(
      "SELECT id, status FROM applications WHERE id = ? AND idea_id = ?"
    ).bind(applicationId, ideaId).first();

    if (!application) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "応募が見つかりません",
        error: "Application not found"
      };
      return c.json(errorResponse, 404);
    }

    if (application.status !== 'pending') {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "この応募は既に審査済みです",
        error: "Application already reviewed"
      };
      return c.json(errorResponse, 400);
    }

    // 応募ステータスを更新
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    await c.env.DB.prepare(`
      UPDATE applications 
      SET status = ?, reviewed_at = CURRENT_TIMESTAMP, review_message = ?
      WHERE id = ?
    `).bind(newStatus, message || '', applicationId).run();

    return c.json({
      success: true,
      message: action === 'approve' ? "応募を承認しました" : "応募を拒否しました",
      application: {
        id: applicationId,
        status: newStatus
      }
    });

  } catch (error) {
    console.error('Review application error:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      message: "応募審査中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});
