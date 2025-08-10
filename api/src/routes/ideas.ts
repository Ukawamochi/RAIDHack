import { Hono } from "hono";
import { 
  AppContext, 
  Idea, 
  IdeasResponse,
  IdeaResponse,
  ErrorResponse,
  CreateIdeaRequest,
  UpdateIdeaStatusRequest,
  UpdateIdeaDeadlineRequest,
  UpdateIdeaProgressRequest,
  ProjectActivity,
  User 
} from "../types";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth";
import { createNotification } from "./notifications";

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
        i.start_date, i.deadline, i.progress_percentage,
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
      i.start_date, i.deadline, i.progress_percentage,
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
        start_date: idea.start_date as string,
        deadline: idea.deadline as string,
        progress_percentage: (idea.progress_percentage as number) || 0,
        created_at: idea.created_at as string,
        updated_at: idea.updated_at as string,
        user: {
          id: idea.user_id as number,
          username: idea.username as string,
          avatar_url: idea.avatar_url || undefined
        },
        like_count: idea.like_count as number,
        user_liked: userId ? Boolean(idea.user_liked) : false
      } as any;
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
        i.start_date, i.deadline, i.progress_percentage,
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
      i.start_date, i.deadline, i.progress_percentage,
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
      start_date: ideaData.start_date as string,
      deadline: ideaData.deadline as string,
      progress_percentage: (ideaData.progress_percentage as number) || 0,
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
    } as any; // 最小限の型修正：一時的にany型でTypeScriptエラーを回避

    const response: IdeaResponse = {
      success: true,
      message: "アイデア詳細を取得しました",
      idea: idea as any // IdeaResponse型も一時的にany型で回避
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
      `INSERT INTO ideas (title, description, required_skills, user_id, status, progress_percentage)
      VALUES (?, ?, ?, ?, 'open', 0) RETURNING id, created_at, updated_at`
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
      progress_percentage: 0,
      created_at: result.created_at as string,
      updated_at: result.updated_at as string,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        skills: user.skills,
        avatar_url: user.avatarUrl
      }
    } as any;

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

    const applicationId = applicationResult.meta.last_row_id as number;

    // 参加申請通知をプロジェクトホストへ送信
    try {
      const applicant = await c.env.DB.prepare(
        "SELECT username FROM users WHERE id = ?"
      ).bind(userId).first();

      await createNotification(
        c.env.DB,
        Number(idea.user_id),
        'application',
        '新しい参加申請',
        `「${String(idea.title)}」に${applicant?.username || 'ユーザー'}さんから参加申請が届きました。`,
        { ideaId, applicationId, applicantId: userId }
      );
    } catch (e) {
      console.warn('Failed to notify host for application:', e);
    }

    return c.json({
      success: true,
      message: "応募を送信しました",
      application: {
        id: applicationId,
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

    // 申請者IDなど詳細を取得
  const appDetail: any = await c.env.DB.prepare(
      `SELECT a.applicant_id, i.title, i.user_id as owner_id
       FROM applications a JOIN ideas i ON a.idea_id = i.id
       WHERE a.id = ?`
    ).bind(applicationId).first();

    // 承認時: チーム作成/メンバー追加 + 応募者へ承認通知
    if (action === 'approve' && appDetail) {
      // 既存チーム確認
      const existingTeam: any = await c.env.DB.prepare(
        "SELECT id FROM teams WHERE idea_id = ?"
      ).bind(ideaId).first();

      let teamId: number;
      if (existingTeam && existingTeam.id) {
        teamId = Number(existingTeam.id);
      } else {
        const teamResult = await c.env.DB.prepare(`
          INSERT INTO teams (idea_id, name, description, status)
          VALUES (?, ?, '', 'active')
        `).bind(ideaId, `${String(appDetail.title)} チーム`).run();
        teamId = Number(teamResult.meta.last_row_id);
      }

      // メンバー追加（重複Uniqueは無視される想定）
  await c.env.DB.prepare(`
        INSERT OR IGNORE INTO team_members (team_id, user_id, role)
        VALUES (?, ?, 'member')
  `).bind(teamId, Number(appDetail.applicant_id)).run();

      // 活動ログ
      await c.env.DB.prepare(`
        INSERT INTO project_activities (project_id, activity_type, description, created_by)
        VALUES (?, 'member_join', ?, ?)
      `).bind(ideaId, `メンバーが参加しました`, userId).run();

      // 応募者へ承認通知
      await createNotification(
        c.env.DB,
        Number(appDetail.applicant_id),
        'application_status',
        '応募が承認されました',
        `あなたの「${String(appDetail.title)}」への参加申請が承認されました。`,
        { ideaId, applicationId, teamId }
      );
    }

    // 拒否時: 応募者へ拒否通知
    if (action === 'reject' && appDetail) {
      await createNotification(
        c.env.DB,
        Number(appDetail.applicant_id),
        'application_status',
        '応募は拒否されました',
        `あなたの「${String(appDetail.title)}」への参加申請は拒否されました。`,
        { ideaId, applicationId }
      );
    }

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

// ステータス変更エンドポイント
ideaRoutes.put('/:id/status', authMiddleware, async (c) => {
  try {
    const ideaId = parseInt(c.req.param('id'));
    const userId = c.get('userId') as number;
    const { status, start_date } = await c.req.json() as UpdateIdeaStatusRequest;

    if (!ideaId || isNaN(ideaId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "無効なアイデアIDです",
        error: "Invalid idea ID"
      };
      return c.json(errorResponse, 400);
    }

    if (!['open', 'development', 'completed'].includes(status)) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "無効なステータスです",
        error: "Invalid status"
      };
      return c.json(errorResponse, 400);
    }

    // アイデアの所有者確認
    const idea = await c.env.DB.prepare(
      "SELECT user_id, status as current_status FROM ideas WHERE id = ?"
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
        message: "このアイデアのステータスを変更する権限がありません",
        error: "Not authorized to update status"
      };
      return c.json(errorResponse, 403);
    }

    // ステータス更新
    let updateQuery = "UPDATE ideas SET status = ?, updated_at = CURRENT_TIMESTAMP";
    let params: any[] = [status];

    // developmentステータスになる場合は開始日を設定
    if (status === 'development' && start_date) {
      updateQuery += ", start_date = ?";
      params.push(start_date);
    }

    // デフォルト期限設定（1ヶ月後）
    if (status === 'development' && !start_date) {
      const defaultDeadline = new Date();
      defaultDeadline.setMonth(defaultDeadline.getMonth() + 1);
      updateQuery += ", start_date = CURRENT_TIMESTAMP, deadline = ?";
      params.push(defaultDeadline.toISOString());
    }

    updateQuery += " WHERE id = ?";
    params.push(ideaId);

    await c.env.DB.prepare(updateQuery).bind(...params).run();

    // プロジェクト活動ログに記録
    await c.env.DB.prepare(`
      INSERT INTO project_activities (project_id, activity_type, description, created_by)
      VALUES (?, 'status_change', ?, ?)
    `).bind(ideaId, `ステータスを「${idea.current_status}」から「${status}」に変更しました`, userId).run();

    return c.json({
      success: true,
      message: "ステータスが正常に更新されました"
    });

  } catch (error) {
    console.error('Update status error:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      message: "ステータス更新中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// 期限設定エンドポイント
ideaRoutes.put('/:id/deadline', authMiddleware, async (c) => {
  try {
    const ideaId = parseInt(c.req.param('id'));
    const userId = c.get('userId') as number;
    const { deadline } = await c.req.json() as UpdateIdeaDeadlineRequest;

    if (!ideaId || isNaN(ideaId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "無効なアイデアIDです",
        error: "Invalid idea ID"
      };
      return c.json(errorResponse, 400);
    }

    if (!deadline) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "期限は必須です",
        error: "Deadline is required"
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
        message: "このアイデアの期限を設定する権限がありません",
        error: "Not authorized to set deadline"
      };
      return c.json(errorResponse, 403);
    }

    // 期限更新
    await c.env.DB.prepare(
      "UPDATE ideas SET deadline = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(deadline, ideaId).run();

    // プロジェクト活動ログに記録
    await c.env.DB.prepare(`
      INSERT INTO project_activities (project_id, activity_type, description, created_by)
      VALUES (?, 'deadline_set', ?, ?)
    `).bind(ideaId, `期限を ${new Date(deadline).toLocaleDateString('ja-JP')} に設定しました`, userId).run();

    return c.json({
      success: true,
      message: "期限が正常に設定されました"
    });

  } catch (error) {
    console.error('Set deadline error:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      message: "期限設定中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// 進捗取得エンドポイント
ideaRoutes.get('/:id/progress', optionalAuthMiddleware, async (c) => {
  try {
    const ideaId = parseInt(c.req.param('id'));
    const userId = c.get('userId') as number | undefined;

    if (!ideaId || isNaN(ideaId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "無効なアイデアIDです",
        error: "Invalid idea ID"
      };
      return c.json(errorResponse, 400);
    }

    // アイデアの詳細情報を取得
    const idea = await c.env.DB.prepare(`
      SELECT 
        i.id, i.title, i.status, i.start_date, i.deadline, i.progress_percentage,
        i.created_at, i.updated_at, i.user_id,
        u.username
      FROM ideas i
      JOIN users u ON i.user_id = u.id
      WHERE i.id = ?
    `).bind(ideaId).first();

    if (!idea) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "アイデアが見つかりません",
        error: "Idea not found"
      };
      return c.json(errorResponse, 404);
    }

    // プロジェクト参加者かどうかをチェック（将来の実装のため）
    const isParticipant = userId && (idea.user_id === userId); // 簡易版：オーナーのみ

    // 進捗情報を計算
    const now = new Date();
  const startDate = (typeof idea.start_date === 'string' || typeof idea.start_date === 'number') ? new Date(idea.start_date as any) : null;
  const deadline = (typeof idea.deadline === 'string' || typeof idea.deadline === 'number') ? new Date(idea.deadline as any) : null;

    let daysElapsed = 0;
    let daysRemaining = 0;
    let totalDays = 0;

    if (startDate && deadline) {
      totalDays = Math.ceil((deadline.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      daysElapsed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      daysRemaining = Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    }

    // 最近のプロジェクト活動を取得
    const activities = await c.env.DB.prepare(`
      SELECT 
        pa.activity_type, pa.description, pa.created_at,
        u.username
      FROM project_activities pa
      JOIN users u ON pa.created_by = u.id
      WHERE pa.project_id = ?
      ORDER BY pa.created_at DESC
      LIMIT 10
    `).bind(ideaId).all();

    return c.json({
      success: true,
      message: "進捗情報を取得しました",
      progress: {
        project: {
          id: idea.id,
          title: idea.title,
          status: idea.status,
          owner: idea.username,
          progress_percentage: idea.progress_percentage
        },
        timeline: {
          start_date: idea.start_date,
          deadline: idea.deadline,
          days_elapsed: daysElapsed,
          days_remaining: daysRemaining,
          total_days: totalDays
        },
        activities: activities.results.map((activity: any) => ({
          type: activity.activity_type,
          description: activity.description,
          created_at: activity.created_at,
          created_by: activity.username
        })),
        permissions: {
          can_update_progress: isParticipant
        }
      }
    });

  } catch (error) {
    console.error('Get progress error:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      message: "進捗情報取得中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// 進捗更新エンドポイント（プロジェクト参加者用）
ideaRoutes.put('/:id/progress', authMiddleware, async (c) => {
  try {
    const ideaId = parseInt(c.req.param('id'));
    const userId = c.get('userId') as number;
    const { progress_percentage } = await c.req.json() as UpdateIdeaProgressRequest;

    if (!ideaId || isNaN(ideaId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "無効なアイデアIDです",
        error: "Invalid idea ID"
      };
      return c.json(errorResponse, 400);
    }

    if (progress_percentage < 0 || progress_percentage > 100) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "進捗率は0-100の範囲で入力してください",
        error: "Invalid progress percentage"
      };
      return c.json(errorResponse, 400);
    }

    // アイデアの所有者確認（将来はプロジェクト参加者も含める）
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
        message: "このプロジェクトの進捗を更新する権限がありません",
        error: "Not authorized to update progress"
      };
      return c.json(errorResponse, 403);
    }

    // 進捗更新
    await c.env.DB.prepare(
      "UPDATE ideas SET progress_percentage = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(progress_percentage, ideaId).run();

    // プロジェクト活動ログに記録
    await c.env.DB.prepare(`
      INSERT INTO project_activities (project_id, activity_type, description, created_by)
      VALUES (?, 'progress_update', ?, ?)
    `).bind(ideaId, `進捗を ${progress_percentage}% に更新しました`, userId).run();

    return c.json({
      success: true,
      message: "進捗が正常に更新されました"
    });

  } catch (error) {
    console.error('Update progress error:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      message: "進捗更新中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});
